import React, { Component } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Contact from './Contact';

import axios from 'axios';

const StyledContainer = styled.div`
  width: 100%;
  margin-top: 110px;
`;
const StyledInnerContainer = styled.div`
  z-index: 9999;
  position: fixed;
  width: 100%;
  display: flex;
  top: 60px;
  height: 50px;
  background-color: white;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-family: FontAwesome, Arial, Helvetica, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: ${({ theme }) => theme.fontSize.s};
  text-decoration: inherit;
  padding: 10px;
  ::placeholder {
    opacity: 0.4;
  }
`;

export class MainView extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      contacts: undefined,
    };
  }

  componentDidMount() {
    this.getData();
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleToggleChange = (id) => {
    const index = this.state.contacts.findIndex((o) => o.id === id);
    let newContacts = [...this.state.contacts];
    if (newContacts[index].checked === true) {
      newContacts[index] = {
        ...newContacts[index],
        checked: false,
      };
    } else {
      newContacts[index] = {
        ...newContacts[index],
        checked: true,
      };
    }

    this.setState({ contacts: newContacts });
  };

  filterByValue(array, string) {
    return array.filter((o) => {
      return Object.keys(o).some((k) => {
        if (typeof o[k] === 'string') return o[k].toLowerCase().includes(string.toLowerCase());
      });
    });
  }

  async getData() {
    axios
      .get('https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json')
      .then((res) => {
        this.setState({ contacts: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const { contacts } = this.state;
    return (
      <div>
        <Navbar />
        <StyledInnerContainer>
          <StyledInput
            type="text"
            placeholder="&#xF002;"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </StyledInnerContainer>
        <StyledContainer>
          {contacts ? (
            this.filterByValue(contacts, this.state.value)
              .sort((a, b) => (a.last_name > b.last_name ? 1 : -1))
              .map((contact, index) => (
                <Contact
                  contact={contact}
                  key={index}
                  handleToggleChange={this.handleToggleChange}
                />
              ))
          ) : (
            <p>...Loading</p>
          )}
        </StyledContainer>
      </div>
    );
  }
}

export default MainView;
