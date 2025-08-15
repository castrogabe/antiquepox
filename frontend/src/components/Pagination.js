import React from 'react';
import { Button } from 'react-bootstrap';
// We are replacing LinkContainer with Link from react-router-dom to fix the import error.
import { Link } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, getFilterUrl }) => {
  return (
    <div className='flex justify-center mt-6 space-x-2'>
      {/* Loop through the total number of pages to create a button for each one */}
      {[...Array(totalPages).keys()].map((x) => (
        <Link key={x + 1} className='mx-1' to={getFilterUrl({ page: x + 1 })}>
          <Button
            // Highlight the current page button
            className={Number(currentPage) === x + 1 ? 'font-bold' : ''}
            variant='light'
          >
            {x + 1}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
