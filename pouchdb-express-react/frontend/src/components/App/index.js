import React from 'react';
import PouchDB from 'pouchdb-browser'
import uuidv4 from 'uuid/v4';

const db = new PouchDB('not_a_todo_list');
const remoteDatabase = new PouchDB(`http://127.0.0.1:3005/not_a_todo_list`);


// db.replicate.from(remoteDatabase).on('complete', function (res) {
//     console.log('complete', res)
// }).on('error', function (err) {
//     console.log('no completed', err)
// });


// PouchDB.sync(db, remoteDatabase, {
//     live: true,
//     heartbeat: false,
//     timeout: false,
//     retry: true
// }).on("change", function(info) {
//     console.log("change", info);
// }).on("complete", function(info) {
//     console.log("complete", info)
// }).on("error", function(error) {
//     console.log("error", error)
// });

export class App extends React.Component {
    state = {
        docID: "1",
        docActualizar: "1"
    }

    onChange = (e) => {
        this.setState({
            docID: e.target.value
        })
    }

    onChangeUpdate = (e) => {
        this.setState({
            docActualizar: e.target.value
        })
    }

    postAllDocs = (e) => {
        remoteDatabase.replicate.to(db).on('complete', function (res) {
            console.log('complete', res)
        }).on('error', function (err) {
            console.log('no completed', err)
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.postAllDocs}>button test</button>
                <input value={this.state.docID} onChange={this.onChange} /><br></br>
                <button onClick={() =>
                    db.put({ _id: this.state.docID, name: this.state.docID, completed: false }).then((result) => {
                        console.log(result);
                    }).catch((err) => {
                        console.log(err)
                    })
                }>Crear</button>
                <br></br>
                <button onClick={() =>
                    db.get(this.state.docID).then(function (doc) {
                        console.log(doc);
                    }).catch((err) => {
                        console.log(err)
                    })
                }>Leer</button>
                <br></br>
                <input value={this.state.docActualizar} onChange={this.onChangeUpdate} />
                <button onClick={() =>
                    db.get(this.state.docID).then(function (doc) {
                        doc.name = this.state.docActualizar;
                        db.put(doc).then((result) => {
                            console.log(result);
                        }).catch((err) => {
                            console.log(err);
                        })
                        console.log(doc);
                    }).catch((err) => {
                        console.log(err);
                    })
                }>Actualizar</button>
                <br></br>
                <button onClick={() =>
                    remoteDatabase.get(this.state.docID).then(function (doc) {
                        console.log(doc);
                        doc._deleted = true;
                        return remoteDatabase.put(doc);
                    }).catch((err) => {
                        console.log(err);
                    })
                }>Borrar</button>

                <button onClick={() => {

                    remoteDatabase.get(this.state.docID, { open_revs: 'all' })
                        .then(function (data) {
                            console.log(data)
                            console.log(data[0].ok)
                            if (data[0].ok._deleted) {
                                data[0].ok._deleted = false
                                remoteDatabase.put(data[0].ok)
                            }
                        });
                }
                }>
                    Recuperar
                </button>
                <button onClick={() => {
                    remoteDatabase.get(this.state.docID, { revs_info: true })
                        .then(function (data) {
                            console.log(data)
                        });
                }}>
                    Ver versiones
                </button>
                <button onClick={() => {
                    remoteDatabase.get(this.state.docID, { revs_info: true })
                        .then(function (data) {
                            console.log(data);
                            data._revs_info.map((item) => {
                                if (item.status === 'available') {
                                    remoteDatabase.get(data._id, { rev: item.rev })
                                        .then(function (data) {
                                            console.log(data)
                                        });
                                }
                            })
                        });
                }}>
                    Ver versiones con docs
                </button>
                <button onClick={() => {
                    db.changes({
                        filter: function (doc) {
                            console.log("filter", doc);
                            return doc._deleted;
                        }
                    }).on('change', function (change) {
                        console.log("change", change);
                    })
                }}>
                    Ver Eliminados
                </button>
                <button onClick={() => {
                    db.get(this.state.docID, { rev: '10-02c782fffb643967210df76fc4ac13ba' })
                        .then(function (data) {
                            console.log(data)
                            // data[0].ok._deleted = false
                            // console.log(data[0].ok)
                            // if (data[0].ok._deleted) {
                            //     remoteDatabase.put(data[0].ok)
                            // }
                        });
                }}>
                    Versión especifica
                </button>
                <button onClick={() => {
                    return db.compact().then(function (info) {
                        console.log(info)
                    }).catch(function (err) {
                        console.log(err)
                    });
                }}>
                    Compactar BD
                </button>
            </div >
        );
    }
}

export default App;