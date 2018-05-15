import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post.jsx';
import SearchBar from './SearchBar.jsx';
import Nav from './Nav.jsx';
import CreatePost from './CreatePost.jsx';

const theme = "dark"

//TODO remove those inline styles and replace by two different themes. Checkout the Nav how the theme is passed down.
// https://material.io/tools/color/#!/?view.left=0&view.right=0
const styles = {
  nomargin: {
    margin: 0
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    //NOTE Read about refs https://reactjs.org/docs/refs-and-the-dom.html
    this.searchRef = React.createRef();
    this.state = {
      posts: [],
      form: {},
      search: "",
      editing: null
    }
   }
  componentDidMount = () => {
    fetch(`http://localhost:3000/api/posts`).then(resp => resp.json()).then(posts => {
      this.setState({posts});
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let form = {...this.state.form}
    fetch("http://localhost:3000/api/posts", {
         method: "POST",
         body: JSON.stringify(form),
         headers: {
           "content-type": "application/json"
         }
       }).then(response => response.json())
       .then(response => {
         M.toast({html: `Post ${form.name} created!`})
         let posts = [...this.state.posts]
         posts.push(response.post)
         this.setState({posts});
         document.forms["submitform"].reset()
       });

  }
  handleChange = (event) => {
    let form = { ...this.state.form };
    if (event.target.value !== "") {
      form[event.target.id] = event.target.value
    }
    this.setState({form: form});
  }

  handleSearch = (e) => {
    this.setState({search: this.searchRef.current.value});
  }

  handleDelete = (id) => {
    event.preventDefault();
    let form = {...this.state.form}
    fetch(`http://localhost:3000/api/posts/${id}`, {
      method: "DELETE",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json"
      }
    }).then(response => response.json())
       .then(response => {
        console.log(response)
        fetch(`http://localhost:3000/api/posts`).then(resp => resp.json()).then(posts => {
         M.toast({html: `Post ${form.name} deleted!`})
         this.setState({posts});
        });
    })
  }

  handleUpdate = (event, post) => {
    event.preventDefault();
    let form = {...this.state.form}
    fetch(`http://localhost:3000/api/posts/${post._id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json"
      }
    }).then(response => response.json())
       .then(response => {
        console.log(response)
        fetch(`http://localhost:3000/api/posts`).then(resp => resp.json()).then(posts => {
         M.toast({html: `Post ${form.name} updated!`})
         this.setState({posts, editing: null});
        });
    })
  }

  handleEdit = (post) => {
    this.setState({
      form: post,
      editing: post
    })
  }
  handleCancel = (e) => {
    this.setState({
      editing: null
    })
  }
  render() {
    const posts = this.state.search !== "" ? this.state.posts.filter(p => p.name.toLowerCase().includes(this.state.search.toLowerCase())) : this.state.posts
    const posttemplate =
      (<ul className="collection">
        {posts.map(post => (
          <Post
            editing={this.state.editing}
            handleUpdate={this.handleUpdate}
            handleCancel={this.handleCancel}
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}
            handleChange={this.handleChange}
            post={post}
            key={post._id}
          />
        ))
        }
      </ul>
      )

  return (
    <div>
      <Nav theme={theme}/>
      <div className="container" >
        <div className="my-3 card">
          <CreatePost
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            form={this.state.form}
          />
        </div>
        <div className="my-3 card">
          <div className="card-content">
            <h4 style={styles.nomargin}>List of all posts:</h4>
          </div>
          <SearchBar inputRef={this.searchRef} handleSearch={this.handleSearch}/>
          {posts.length > 0 ? posttemplate : <div className="card-content">Nothing found</div> }
        </div>
      </div>
    </div>
    );
  }
}

export default App;
