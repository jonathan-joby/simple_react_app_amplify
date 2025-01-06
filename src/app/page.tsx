'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Property {
  zpid: number;
  street_address: string;
  city: string;
  state: string;
  zip_code: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  year_built: number;
  status: string;
  photos: {
    url_768: string;
    url_1536: string;
  }[];
}

const Page = () => {
  const [propertiesSummary, setPropertiesSummary] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [zpid, setZpid] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch properties summary from Lambda
  const fetchPropertiesSummary = async () => {
    try {
      const response = await axios.get(`${apiUrl}/properties/summary`);
      setPropertiesSummary(response.data);
    } catch (error) {
      console.error('Error fetching properties summary:', error);
    }
  };

  // Fetch list of properties from Lambda
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${apiUrl}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Fetch property details based on ZPID
  const fetchPropertyDetail = async () => {
    if (!zpid) return;
    try {
      const response = await axios.get(`${apiUrl}/property?zpid=${zpid}`);
      setPropertyDetail(response.data);
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  useEffect(() => {
    fetchPropertiesSummary();
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchPropertyDetail();
  }, [zpid]);

  return (
    <div>
      <h1>Property Data</h1>

      <h2>Properties Summary</h2>
      {propertiesSummary ? (
        <pre>{JSON.stringify(propertiesSummary, null, 2)}</pre>
      ) : (
        <p>Loading properties summary...</p>
      )}

      <h2>All Properties</h2>
      <ul>
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <li key={index}>{property.address}</li>
          ))
        ) : (
          <p>Loading properties...</p>
        )}
      </ul>

      <h2>Property Details</h2>
      <input
        type="text"
        value={zpid}
        onChange={(e) => setZpid(e.target.value)}
        placeholder="Enter ZPID"
      />
      <button onClick={fetchPropertyDetail}>Get Property Details</button>

      {propertyDetail ? (
        <pre>{JSON.stringify(propertyDetail, null, 2)}</pre>
      ) : (
        <p>No property details found.</p>
      )}
    </div>
  );
};

export default Page;
