// http://localhost:8000/api/seed
// go to this link and it will load the data into the database

import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Gabe',
      email: 'gabudemy@gmail.com',
      password: bcrypt.hashSync('Gabe1234'),
      isAdmin: true,
    },
    {
      name: 'Jack',
      email: 'jack@email.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Asian Snuff Bottle',
      slug: 'Snuff Bottle',
      category: 'Asian',
      image: '/images/1a.jpg',
      price: 50,
      countInStock: 10,
      from: 'China',
      finish: 'Bone & Metal',
      rating: 5,
      numReviews: 1,
      description:
        'Handmade with metal, camel bone, and wood.  Asian snuff bottle, has makers mark on bottom.',
    },
    {
      name: 'Madonna and Child',
      slug: 'Madonna and Child',
      category: 'Religious',
      image: '/images/2a.jpg',
      price: 50,
      countInStock: 5,
      from: 'Italy',
      finish: 'Wood and Gold Leaf',
      rating: 5,
      numReviews: 1,
      description: 'Made in Italy, Madonna and Child wall plack unframed',
    },
    {
      name: 'Carved Wood Cup',
      slug: 'Carved Wood Cup',
      category: 'Asian',
      image: '/images/3a.jpg',
      price: 50,
      countInStock: 1,
      from: 'China',
      finish: 'Wood',
      rating: 5,
      numReviews: 1,
      description: 'From China, hand carved wood shaped like a cup.',
    },
    {
      name: 'Spiral Staircase',
      slug: 'Staircase',
      category: 'Wood',
      image: '/images/4a.jpg',
      price: 500,
      countInStock: 0,
      from: 'America',
      finish: 'Wood',
      rating: 5,
      numReviews: 1,
      description:
        'Hand made spiral staircase inspired by Sam Maloof staircase, Curly Maple base, Apitong wood stairs, spire, and 4 layer lamination handrail, made by Gabe Castro.',
    },
    {
      name: 'Jade Grapes',
      slug: 'Jade Grapes',
      category: 'Asian',
      image: '/images/5a.jpg',
      price: 100,
      countInStock: 10,
      from: 'China',
      finish: 'Jade',
      rating: 5,
      numReviews: 1,
      description: 'Mid Century Hand Carved Jade Grapes.',
    },
    {
      name: 'Terra Cotta Jug',
      slug: 'Terra Cotta Jug',
      category: 'Ceramic',
      image: '/images/6a.jpg',
      price: 100,
      countInStock: 5,
      from: 'Italy',
      finish: 'Glazed',
      rating: 5,
      numReviews: 1,
      description: 'Hand made in Italy Terra Cotta two handled jug.',
    },
    {
      name: 'Metal Asian Horse',
      slug: 'Horse',
      category: 'Metal',
      image: '/images/7a.jpg',
      price: 25,
      countInStock: 1,
      from: 'Japan',
      finish: 'Gold',
      rating: 5,
      numReviews: 1,
      description:
        'Hand painted Chinese Rose Medallion Decorative plate, makers mark on bottom.',
    },
    {
      name: 'Asian Nun',
      slug: 'Asian Nun',
      category: 'Religious',
      image: '/images/8a.jpg',
      price: 25,
      countInStock: 0,
      from: 'Japan',
      finish: 'Metal and Gold Leaf',
      rating: 5,
      numReviews: 1,
      description: 'Hand painted Japanese Nun, Metal and Gold Leaf.',
    },
    {
      name: 'Celadon Brush Pot',
      slug: 'Celadon Brush Pot',
      category: 'Asian',
      image: '/images/9a.jpg',
      price: 125,
      countInStock: 10,
      from: 'China',
      finish: 'Stone',
      rating: 5,
      numReviews: 1,
      description: 'Hand Carved Chinese Celadon Stone, Brush Pot.',
    },
    {
      name: 'Asian Clock',
      slug: 'Asian Clock',
      category: 'Clock',
      image: '/images/10a.jpg',
      price: 50,
      countInStock: 5,
      from: 'American',
      finish: 'Wood and Stencil',
      rating: 5,
      numReviews: 1,
      description:
        'Made in America, Asian inspired Quartz AA battery table top clock',
    },
    {
      name: 'Sandstone MudMan',
      slug: 'Sandstone MudMan',
      category: 'Asian',
      image: '/images/11a.jpg',
      price: 125,
      countInStock: 1,
      from: 'China',
      finish: 'Sandstone',
      rating: 5,
      numReviews: 1,
      description: 'Hand Carved Chinese Sandstone MudMan.',
    },

    {
      name: 'Wood Bowl Branch',
      slug: 'Bowl',
      category: 'Wood',
      image: '/images/12b.jpg',
      price: 250,
      countInStock: 0,
      from: 'American',
      finish: 'Wood',
      rating: 5,
      numReviews: 1,
      description:
        'Hand Made decorative art piece, Mesquite wood hand turned by Mark Jackofsky.',
    },
    {
      name: 'Asian Rice Container',
      slug: 'Container',
      category: 'Asian',
      image: '/images/13a.jpg',
      price: 300,
      countInStock: 10,
      from: 'China',
      finish: 'Painted Wood',
      rating: 5,
      numReviews: 1,
      description:
        'Large Chinese hand painted wooden rice container, 1930 era.',
    },
    {
      name: 'Pablo Picasso Print',
      slug: 'Art Print',
      category: 'Art',
      image: '/images/14a.jpg',
      price: 500,
      countInStock: 5,
      from: 'Spain',
      finish: 'Paper',
      rating: 5,
      numReviews: 1,
      description: 'La espara (Margot) Print by Pablo Picasso.',
    },
    {
      name: 'Alice Sweede Painting',
      slug: 'Art Painting',
      category: 'Art',
      image: '/images/15a.jpg',
      price: 300,
      countInStock: 1,
      from: 'American',
      finish: 'Oil on Canvas',
      rating: 5,
      numReviews: 1,
      description: 'Roses round painting done by Alice Sweede.',
    },
    {
      name: 'Granite Foot Stool',
      slug: 'Foot Stool',
      category: 'Asian',
      image: '/images/16a.jpg',
      price: 300,
      countInStock: 0,
      from: 'China',
      finish: 'Granite',
      rating: 5,
      numReviews: 1,
      description: 'Hand carved Granite Chinese foot stool.',
    },

    {
      name: 'Mantle Clock',
      slug: 'Mantle Clock',
      category: 'Clock',
      image: '/images/7a.jpg',
      price: 200,
      countInStock: 10,
      from: 'England',
      finish: 'Wood, Enamel',
      rating: 5,
      numReviews: 1,
      description:
        'English Mantle Clock, Turn of the century antique, work great.',
    },
    {
      name: 'Rose Medallion Plate',
      slug: 'Plate',
      category: 'Asian',
      image: '/images/18a.jpg',
      price: 100,
      countInStock: 5,
      from: 'China',
      finish: 'Ceramic',
      rating: 5,
      numReviews: 1,
      description:
        'Hand painted Chinese Rose Medallion Decorative plate, makers mark on bottom.',
    },
    {
      name: 'Pablo Picasso Dove Print',
      slug: 'Pablo Picasso Dove Print',
      category: 'Art',
      image: '/images/19a.jpg',
      price: 500,
      countInStock: 1,
      from: 'Spain',
      finish: 'Acrylic',
      rating: 5,
      numReviews: 1,
      description: 'Dove Print by Pablo Picasso.',
    },
    {
      name: 'Rose Medallion Vase',
      slug: 'Rose Medallion Vase',
      category: 'Asian',
      image: '/images/20a.jpg',
      price: 250,
      countInStock: 0,
      from: 'China',
      finish: 'Ceramic',
      rating: 5,
      numReviews: 1,
      description:
        'Hand painted Chinese Rose Medallion Decorative vase, makers mark on bottom.',
    },
  ],
};
export default data;
