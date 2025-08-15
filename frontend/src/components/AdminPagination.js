import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminPagination = ({
  currentPage,
  totalPages,
  isAdmin = true,
  keyword = '',
}) => {
  const makeTo = (page) => {
    if (isAdmin && keyword === '') return `/admin/products?page=${page}`;
    if (!isAdmin && keyword === '') return `/products?page=${page}`;
    if (keyword === 'OrderList')
      return isAdmin ? `/admin/orders?page=${page}` : `/orders?page=${page}`;
    if (keyword === 'UserList')
      return isAdmin ? `/admin/users?page=${page}` : `/users?page=${page}`;
    if (keyword === 'Messages')
      return isAdmin
        ? `/admin/messages?page=${page}`
        : `/messages?page=${page}`;
    return '/';
  };

  const total = Number(totalPages) || 0;
  const curr = Number(currentPage);

  return (
    <div>
      {Array.from({ length: total }, (_, i) => {
        const page = i + 1;
        return (
          <Button
            key={page}
            as={Link}
            to={makeTo(page)}
            className={`mx-1 ${curr === page ? 'text-bold' : ''}`}
            variant='light'
          >
            {page}
          </Button>
        );
      })}
    </div>
  );
};

export default AdminPagination;
