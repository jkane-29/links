Awesome Search
=
[![Awesome](https://awesome.re/badge-flat.svg)](https://awesome.re)  
https://awesomelists.top  
This is an new version of [Awesome Search](https://github.com/lockys/AwesomeSearch)   

Kudos
==
- [John-Lin](https://github.com/John-Lin)'s powerful support.
- The original domain name `http://awesomelists.me/` is provided by [@aleksandar-todorovic](https://github.com/aleksandar-todorovic), thanks!  
- Thanks [bashooka](http://bashooka.com/coding/35-best-css-tools-for-2017/) for recommendation.

Why
==
In a nutshell, there are many awesome lists in the sindresorhus/awesome.
We hope to build an application to access them more quickly.  
That's why "Awesome Search" was born.

Features
==
✔ Access and search every awesome repo collected in [sindresorhus/awesome](https://github.com/sindresorhus/awesome) in one page quickly.   
✔ Access an awesome repo by `https://dev.awesomelists.top/#/sindresorhus/awesome-nodejs`. (you can BOOKMARK it!)  
✔ Use Github API to retrieve README file of an awesome repo, so it's up-to-date.  

Local CSV Link Search
==
- Put your link data in `public/filter_links.csv` (current expected headers: `episode_number, guest, episode_title, url, twitter, type`).
- The app now builds broad categories from row metadata and domain hints, then exposes those categories in the left menu.
- Search supports semantic-style matching across guest, episode title, type, category, domain, and inferred tags.
- Category and search result display formatting can be adjusted in:
  - `src/components/AwesomeLists/AwesomeLists.js`
  - `src/components/AwesomeInput/AwesomeInput.js`
  - `src/components/AwesomeLists/AwesomeLists.module.css`
  - `src/components/AwesomeInput/AwesomeInput.module.css`

Supported awesome lists
==
You can see the JSON format of sindresorhus/awesome in [here](https://github.com/lockys/Awesome.json/blob/master/awesome/awesome.json).
[awesome.json](https://github.com/lockys/awesome.json) file is the place where our data stores for now.

Authors
==
- [lockys](https://github.com/lockys)
- [John-Lin](https://github.com/John-Lin)

Contributions
==
PRs are always welcome. :)  
Also, Filing a issue to make suggestions or complain anything is always welcome.

Related Projects
==
- [John-Lin/awesomelists-index](https://github.com/John-Lin/awesomelists-index) - converts an awesome list into a JSON file
- [lockys/awesome.json](https://github.com/lockys/awesome.json) - converts [sindresorhus's awesome](https://github.com/sindresorhus/awesome) to json
- [getAwesomeness()](https://github.com/panzhangwang/getAwesomeness) - search engine based on local JSON data

Credit
==
Thanks all awesome authors for creating these awesome lists.  
- [sindresorhus/awesome](https://github.com/sindresorhus/awesome)  
- [All awesome list contributors](https://github.com/sindresorhus/awesome/graphs/contributors)  
![awesome](http://i.imgur.com/qcroMhk.gif)

LICENSE
==
The MIT License (MIT)

Copyright (c) 2021 Hao-Wei Jeng, Che-Wei Lin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
