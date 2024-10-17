import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Search.css'; 
import Item from '../../Item/Item';

const SearchResultPage = () => {
    const { searchTerm } = useParams(); // Lấy tham số từ URL

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:5000/searchproduct`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: searchTerm }),
                });

                const data = await response.json();
                if (data.success) {
                    setProducts(data.products);
                } else {
                    console.error('Error fetching products:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSearchResults();
    }, [searchTerm]);

    return (
        <div className="search-result-page">
            <h2>Kết quả tìm kiếm cho "{searchTerm}"</h2>
            <div className="search-results">
                {products.map((product) => (
                    <Item
                        key={product.id}
                        id={product.id}
                        image={product.image}
                        name={product.name}
                        new_price={product.new_price}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchResultPage;
