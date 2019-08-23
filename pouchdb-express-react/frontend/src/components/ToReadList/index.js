import React from 'react';

export class ToReadList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            elements: null,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.setState({
            loading: true,
            elements: null,
        });
        this.props.db.allDocs({
            include_docs: true,
        }).then(result => {
            const rows = result.rows;
            this.setState({
                loading: false,
                elements: rows.map(row => row.doc),
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        if (this.state.loading || this.state.elements === null) {
            return <div>loading...</div>;
        }
        return (<div>...</div>);
    }
}

export default ToReadList;