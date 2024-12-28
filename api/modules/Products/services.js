/* 
    (In-memory store)
    Mock products data set 
*/
const products = [
    {
        id: 1,
        title: 'Item A',
        price: 30,
        image: 'a.jpg',
        description: 'Phasellus quis lectus et metus iaculis suscipit eu in tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.'
    },
    {
        id: 2,
        title: 'Item B',
        price: 50,
        image: 'b.jpg',
        description: 'Aliquam erat volutpat. Praesent interdum ligula sed libero scelerisque, in varius turpis fringilla. Nunc feugiat a nibh non aliquet. Vivamus.'
    },
    {
        id: 3,
        title: 'Item C',
        price: 25,
        image: 'c.jpg',
        description: 'Quisque vel ex congue, aliquam turpis gravida, tincidunt mi. Vestibulum enim est, consectetur at elit ut, auctor fermentum velit. Cras.'
    },
    {
        id: 4,
        title: 'Item D',
        price: 30,
        image: 'd.jpg',
        description: 'Ut ultrices erat scelerisque lorem malesuada malesuada. Vivamus non sapien semper, viverra lacus id, scelerisque neque. Pellentesque malesuada a nibh.'
    },
    {
        id: 5,
        title: 'Item E',
        price: 35,
        image: 'e.jpg',
        description: 'In posuere eros id ante ultricies tempor a id metus. Integer lobortis non turpis et accumsan. Vestibulum ante ipsum primis.'
    },
    {
        id: 6,
        title: 'Item F',
        price: 40,
        image: 'f.jpg',
        description: 'Curabitur scelerisque elementum ex ac posuere. Donec suscipit vitae mi eu fringilla. Vivamus ut enim sed ex vulputate imperdiet. Nullam.'
    }
]

/*
    Function to fetch products
*/
const getProducts = (req,res) => {
    res.json(products)
}

module.exports = {
    getProducts
}

