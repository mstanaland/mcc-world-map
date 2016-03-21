![preview](https://github.com/mstanaland/oxfam-knowledge-hubs/blob/master/preview.jpg)

#Knowledge hub "quick fix" template
A single page, flat-file solution for displaying information about a knowledge hub's operations around the world. This is intended as a quick fix to get the information up on the web site while changes to the CMS are made so the information can be stored in a more permanent way in the database.

This project is based off work done for the Extractive Industries group, but has been made more generic for use by any Oxfam group. 

All information is stored in a CSV file that can be edited using Google Sheets, Excel or any spreadsheet program.
For multi-language pages, use one CSV per language.

To trigger loading of a different CSV file, use an anchor tag with a `data-filename` attribute with the path to the CSV to load.
```
<a href="javascript:;" data-filename="data/deutsche.csv">Deutsche</a>
```

## Getting started
1. `npm install` to install the node dependencies
2. `bower install` to install the front-end dependencies
3. `gulp serve` to preview


### Distribution build
* `gulp` to create the distribution build
* `gulp serve:dist` to preview the distribution build

