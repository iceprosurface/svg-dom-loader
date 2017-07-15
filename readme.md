## svg-dom-loader

## intruduction

A web plugin for transforming svg into dom element,prefer working in flow chart to others.

## install

```
npm install svg-dom-loader
```

## usage
```
    module: {
      loaders: [
        {test: /\.svg$/,loader: 'svg-loader'}
      ],
    },
```

Perhaps svg may like this: 

```
<svg>
    <circle cx="30" cy="33" r="30" style="fill:rgb(170,130,183); stroke:none;"></circle>
    <circle cx="30" cy="33" r="14" style="stroke-width:2; stroke:#fff; fill:none;"></circle>
    <rect width="14" height="30" x="23" y="10" style="fill:rgb(170,130,183); stroke:none;"></rect>
    <path d="M30 16 L30 33" style="fill:none; stroke:white; stroke-width:2;"></path>
    <circle data-entry="1" cx="30" cy="6" style="fill:rgb(213,218,239); stroke:rgb(89,130,175); stroke-width:1;" r="5"></circle>
</svg>
```

parse:
```
var svg = require('./test.svg')
```

parsed:

```
<g>
    <circle cx="30" cy="33" r="30" style="fill:rgb(170,130,183); stroke:none;"></circle>
    <circle cx="30" cy="33" r="14" style="stroke-width:2; stroke:#fff; fill:none;"></circle>
    <rect width="14" height="30" x="23" y="10" style="fill:rgb(170,130,183); stroke:none;"></rect>
    <path d="M30 16 L30 33" style="fill:none; stroke:white; stroke-width:2;"></path>
    <circle cx="30" cy="6" style="fill:rgb(213,218,239); stroke:rgb(89,130,175); stroke-width:1;" r="5"></circle>
</g>
```

data construction:

```
{
	// root element 
	root,
	// el, the element which contain attribution `data-entry`
	// attr, the element`s attribution
	entries: [{el,attr}...],
	exits: [{el,attr}...],
	labels: [{el,attr}...],
}
```

