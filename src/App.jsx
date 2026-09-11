/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    foundcategory => foundcategory.id === product.categoryId,
  );
  const user = usersFromServer.find(
    founduser => founduser.id === category.ownerId,
  );

  return { ...product, category, user };
});

function getVisibleProducts(
  allProducts,
  selectedUserId,
  query,
  selectedCategoryIds,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return allProducts.filter(product => {
    const matchesUser =
      selectedUserId === null || product.user.id === selectedUserId;

    const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory =
      selectedCategoryIds.length === 0 ||
      selectedCategoryIds.includes(product.category.id);

    return matchesUser && matchesQuery && matchesCategory;
  });
}

const DEFAULT_QUERY = '';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const visibleProducts = getVisibleProducts(
    products,
    selectedUserId,
    query,
    selectedCategoryIds,
  );

  function handleCategoryToggle(categoryId) {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(
        selectedCategoryIds.filter(id => id !== categoryId),
      );
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': selectedUserId === null,
                })}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query !== DEFAULT_QUERY && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      aria-label="Clear search"
                      className="delete"
                      onClick={() => setQuery(DEFAULT_QUERY)}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategoryIds.length > 0,
                })}
                onClick={() => setSelectedCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategoryIds.includes(category.id),
                  })}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                onClick={() => {
                  setSelectedUserId(null);
                  setQuery(DEFAULT_QUERY);
                  setSelectedCategoryIds([]);
                }}
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
          {visibleProducts.length !== 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
