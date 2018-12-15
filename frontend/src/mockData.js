export const mockFeatures = [
    {key: 1, value: 'Kid-Friendly', text: 'Kid-Friendly'},
    {key: 2, value: 'Wineyard', text: 'Wineyard'},
    {key: 3, value: 'River', text: 'River'},
    {key: 4, value: 'Forest', text: 'Forest'},
    {key: 5, value: 'Dogs Allowed', text: 'Dogs Allowed'},
    {key: 6, value: 'Lake', text: 'Lake'}
];
export const mockData = [{
    "_id": "5c122720beb6041c983a6c3f",
    "highlights": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "distance": [2.6999999999999997],
    "features": ["River", "Dogs Allowed"],
    "title": "Flussweg",
    "description": "schöner Weg in der Nähe der Parkinsel",
    "difficulty": "easy",
    "points": [{
        "_id": "5c122720beb6041c983a6c49",
        "lat": 49.477934497488164,
        "lng": 8.455563284414188
    }, {
        "_id": "5c122720beb6041c983a6c48",
        "lat": 49.475927431887165,
        "lng": 8.457538414694318
    }, {
        "_id": "5c122720beb6041c983a6c47",
        "lat": 49.47436632399818,
        "lng": 8.458053666071763
    }, {
        "_id": "5c122720beb6041c983a6c46",
        "lat": 49.473083948151675,
        "lng": 8.456422036709903
    }, {
        "_id": "5c122720beb6041c983a6c45",
        "lat": 49.471801538730794,
        "lng": 8.454618656888906
    }, {
        "_id": "5c122720beb6041c983a6c44",
        "lat": 49.470184539866985,
        "lng": 8.452471776149643
    }, {
        "_id": "5c122720beb6041c983a6c43",
        "lat": 49.46706190824681,
        "lng": 8.448779141278125
    }, {
        "_id": "5c122720beb6041c983a6c42",
        "lat": 49.4660581629554,
        "lng": 8.44663226053886
    }, {
        "_id": "5c122720beb6041c983a6c41",
        "lat": 49.46795410901985,
        "lng": 8.443540752274316
    }, {"_id": "5c122720beb6041c983a6c40", "lat": 49.46700614515898, "lng": 8.441136245846309}],
    "user": "5c0bec10ed87741f7c962cd4",
    "image": "5c12271fbeb6041c983a6c3e",
    "created": "2018-12-13T09:32:16.087Z",
    "__v": 0,
    "avg_rating": 4.5,
    "isFavorised": true
}];

export const mockRatings = [{
    "_id": "5c13da35ab32df10d8f2aee0",
    "route": "5c122720beb6041c983a6c3f",
    "rating": 4,
    "user": {
        "_id": "5c1276563a0d4e13b86f339a",
        "username": "user1",
        "email": "user@web.de",
        "password": null,
        "__v": 0
    },
    "comment": "1",
    "image": "5c13da35ab32df10d8f2aedf",
    "created": "2018-12-14T16:28:37.722Z",
    "__v": 0
}, {
    "_id": "5c14e447a9adab0a0ce112e7",
    "route": "5c122720beb6041c983a6c3f",
    "rating": 5,
    "comment": "test",
    "user": {
        "_id": "5c13e425bc1226146c97ff39",
        "username": "test1234",
        "email": "test1234@web.de",
        "password": null,
        "__v": 0
    },
    "created": "2018-12-15T11:23:51.314Z",
    "__v": 0
}];


export const mockHighlights = [{
    "_id": "5c0ebb4f1bdde416584f48a0",
    "name": "testte",
    "description": "test",
    "latitude": 49.34984843788718,
    "longitude": 8.43642770099589,
    "__v": 0
}, {
    "_id": "5c0ebb581bdde416584f48a1",
    "name": "test",
    "description": "test",
    "latitude": 49.348845786856735,
    "longitude": 8.438086166367006,
    "__v": 0
}];

export const mockMyReviews = [{
    "_id": "5c14258f0334a238e04db460",
    "highlights": [0, 0, 0, 0, 0, 0, 1],
    "distance": [0],
    "features": ["Forest", "Lake"],
    "title": "Lake Walk",
    "description": "Nice route around the lake. Stunning viewpoint!",
    "difficulty": "moderate",
    "points": [],
    "location": "Ludwigshafen am Rhein",
    "image": null,
    "created": "2018-12-14T21:50:07.222Z",
    "__v": 0,
    "comments": [{
        "_id": "5c13e494a86dae0b18343ae9",
        "route": "5c123f16beb6041c983a6c6d",
        "rating": 4,
        "comment": "Ja war okay. 2 3 4 5 5",
        "image": "5c13e494a86dae0b18343ae8",
        "user": {
            "_id": "5c13e425bc1226146c97ff39",
            "username": "test1234",
            "email": "test1234@web.de",
            "__v": 0
        },
        "created": "2018-12-14T17:12:52.198Z",
        "__v": 0
    }],
    "avg_rating": 5
}];


export const mockMyRoutes = [{
    "_id": "5c14e789823b3509e01bded8",
    "highlights": [0, 0, 0, 0, 0, 0, 0, 0],
    "distance": 1.3,
    "features": [],
    "title": "Nocheiner",
    "description": "test",
    "difficulty": "easy",
    "points": [],
    "user": "5c13e425bc1226146c97ff39",
    "location": "Ludwigshafen am Rhein",
    "image": null,
    "created": "2018-12-15T11:37:45.607Z",
    "__v": 0,
    "avg_rating": 4
}];

export const mockMyLikedRoutes = [{
    "_id": "5c1227b8beb6041c983a6c4a",
    "highlights": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "distance": 1.5,
    "features": ["Dogs Allowed"],
    "title": "Westweg",
    "description": "kurzer Rundgang",
    "difficulty": "easy",
    "points": [],
    "user": "5c0bec10ed87741f7c962cd4",
    "location": "Ludwigshafen am Rhein",
    "image": null,
    "created": "2018-12-13T09:34:48.259Z",
    "__v": 0,
    "avg_rating": 5
}];