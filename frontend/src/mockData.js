export const mockFeatures = [
    { key: 1, value: 'Kid-Friendly', text: 'Kid-Friendly' },
    { key: 2, value: 'Wineyard', text: 'Wineyard' },
    { key: 3, value: 'River', text: 'River' },
    { key: 4, value: 'Forest', text: 'Forest' },
    { key: 5, value: 'Dogs Allowed', text: 'Dogs Allowed' },
    { key: 6, value: 'Lake', text: 'Lake' }
];
export const mockData = [
    {
        _id: 1,
        name: 'Wanderweg 1',
        description: 'Ganz viel text...',
        address: 'Speyer, RLP, Deutschland',
        distance: 4,
        difficulty: 'moderate',
        rating: 4,
        image: './static/media/RiceTerraces.JPG',
        isFavorised: true,
        features: ['Kid-Friendly', 'Wineyard', 'River'],
        comments: [
            {author: 'Fred', avatar: 1, datetime: '13.11.2018 11:10', text: 'Voll klasse der Wanderweg!', stars: 4},
            {author: 'Lisa', avatar: 1, datetime: '12.11.2018 22:03', text: 'Ja war wirklich cool.', stars: 3},
            {author: 'Peter', avatar: 1, datetime: '11.11.2018 11:01', text: 'Bester Wanderung ever. Vor allem gabs überall Schorle. Hammer.', stars: 5}
        ]
    },
    {
        _id: 2,
        name: 'Wanderweg 2',
        description: 'Ganz viel text...',
        address: 'Speyer, RLP, Deutschland',
        distance: 8,
        difficulty: 'easy',
        rating: 2,
        image: './static/media/RiceTerraces.JPG',
        isFavorised: false,
        features: ['Dogs Allowed', 'Wineyard', 'Forest', 'River'],
        comments: []
    },
    {
        _id: 3,
        name: 'Wanderweg 2',
        description: 'Ganz viel text...',
        address: 'Speyer, RLP, Deutschland',
        distance: 8,
        difficulty: 'easy',
        rating: 2,
        image: './static/media/RiceTerraces.JPG',
        isFavorised: false,
        features: ['Dogs Allowed', 'Wineyard', 'Forest', 'River'],
        comments: []
    }];
