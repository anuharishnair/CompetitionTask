import React from 'react';
import Cookies from 'js-cookie';
import { default as CountriesData } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {
                number: "",
                street: "",
                suburb: "",
                postCode: "",
                city: "",
                country: ""
            },
            countries: CountriesData,
            cities: [],
            isEditing: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleChange(event) {
        var address = Object.assign({}, this.state.address);
        address[event.target.name] = event.target.value;
        this.setState({ address: address });
    }

    handleCountryChange(event) {
        var selectedCountry = event.target.value;
        var cities = this.state.countries[selectedCountry] || [];
        var address = Object.assign({}, this.state.address);
        address.country = selectedCountry;
        address.city = "";
        this.setState({
            address: address,
            cities: cities
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('Address submitted:', this.state.address);
        this.setState({ isEditing: false });
    }

    handleEdit() {
        this.setState({ isEditing: true });
    }

    handleCancel() {
        this.setState({ isEditing: false });
    }

    render() {
        var address = this.state.address;
        var countryOptions = Object.keys(this.state.countries);

        if (this.state.isEditing) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <div style={{ marginTop: '10px' }}>
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={address.number}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter street number"
                            errorMessage="Please enter a valid street number"
                        />
                    </div>
                    <div>
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={address.street}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter street name"
                            errorMessage="Please enter a valid street name"
                        />
                    </div>
                    <div>
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={address.suburb}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter suburb"
                            errorMessage="Please enter a valid suburb"
                        />
                    </div>
                    <div>
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            name="postCode"
                            value={address.postCode}
                            controlFunc={this.handleChange}
                            maxLength={10}
                            placeholder="Enter post code"
                            errorMessage="Please enter a valid post code"
                        />
                    </div>
                    <div>
                        <label>Country</label>
                        <select
                            name="country"
                            value={address.country}
                            onChange={this.handleCountryChange}
                        >
                            <option value="" disabled>Select a country</option>
                            {countryOptions.map(function (country) {
                                return (
                                    <option key={country} value={country}>{country}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label>City</label>
                        <select
                            name="city"
                            value={address.city}
                            onChange={this.handleChange}
                            disabled={!address.country}
                        >
                            <option value="" disabled>Select a city</option>
                            {this.state.cities.map(function (city) {
                                return (
                                    <option key={city} value={city}>{city}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: '10px', marginTop: '10px'}}>
                        <button type="submit" className="ui teal button">Save</button>
                        <button type="button" className="ui button" onClick={this.handleCancel}>Cancel</button>
                    </div>
                </form>
            );
        } else {
            // Construct the address string
            const addressParts = [
                address.number,
                address.street,
                address.suburb,
                address.postCode,
                address.city,
                address.country
            ];

            // Filter out empty fields
            const filteredAddressParts = addressParts.filter(part => part.trim() !== '');

            // Prepare display address based on presence of address parts
            const displayAddress = filteredAddressParts.length > 0
                ? filteredAddressParts.join(', ')
                : '';

            return (
                <div>
                    <p style={{ marginTop: '10px' }}>
                        Address: {displayAddress || "Not specified"}
                    </p>
                    {displayAddress ? (
                        <p style={{ marginTop: '10px' }}>City: {address.city}</p>
                    ) : null}
                    {displayAddress ? (
                        <p>Country: {address.country}</p>
                    ) : null}
                    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <button
                            type="button"
                            className="ui teal button"
                            onClick={this.handleEdit}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            );
        }

    }
}



export class Nationality extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedNationality: props.nationality || "",
            isEditing: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleChange(event) {
        this.setState({ selectedNationality: event.target.value });
    }

    handleEdit() {
        this.setState({ isEditing: true });
    }

    handleSave() {
        const { selectedNationality } = this.state;
        if (this.props.onSave) {
            this.props.onSave(selectedNationality);
        }
        this.setState({ isEditing: false });
    }

    handleCancel() {
        this.setState({
            selectedNationality: this.props.nationality || "",
            isEditing: false
        });
    }

    render() {
        const { selectedNationality, isEditing } = this.state;
        const countryOptions = Array.isArray(CountriesData)
            ? CountriesData.map(country => country.name)
            : Object.keys(CountriesData);

        return (
            <div className="field">
                {isEditing ? (
                    <div>
                        <select
                            className="ui dropdown"
                            value={selectedNationality}
                            onChange={this.handleChange}
                            style={{ marginTop: '10px' }}
                        >
                            <option value="">Select your nationality</option>
                            {countryOptions.map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                        <div style={{ textAlign: 'right', marginBottom: '10px', marginTop: '10px' }}>
                            <button
                                type="button"
                                className="ui teal button"
                                onClick={this.handleSave}
                                style={{ marginRight: '5px' }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="ui button"
                                onClick={this.handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p style={{ marginTop: '10px' }}>
                            Nationality: {selectedNationality || "Not specified"}
                        </p>
                        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                            <button
                                type="button"
                                className="ui teal button"
                                onClick={this.handleEdit}
                                style={{ position: 'relative', bottom: '-5px' }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}