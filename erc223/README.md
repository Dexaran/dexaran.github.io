<h1 style="text-align: center">ERC 223 Info Aggregator</h1>

<h2>Get started</h2>

To run development server:

- Install project dependencies
```` 
npm install 
````

- Run development server:

````
npm run dev
````

App will be available on the [localhost:3000](localhost:3000)

<h2>Working with data</h2>

All records on web page is stored in json files in **src/constants**

<h3>New Article</h3>

To add new Article, Dev Resource or ERC-223 Record:

- **Open** *src/constants/$FILENAME.ts* where $FILENAME is type of record you want to add.

- **Add** new Object to array with following required fields:

````
{
  title: string,
  description: string,
  url: string,
}
````

**Example**: 

````
{
  title: "Known problems of ERC-20 standard",
  description: "This article describes how bad ERC-20 is",
  url: "https://dexaran820.medium.com/known-problems-of-erc20-token-standard-e98887b9532c"
}
````

New card will appear in corresponding list.


**Commit example**: [Add event](https://github.com/Dalcor/github.io/commit/0c5d868ce7d5608a6fd9af664310bfcfac1514b6)

<h3>Card Images</h3>

To add background image for Article, Dev Resource or ERC-223 card:

- Add image to following folder: *public/images/articles*

- Add image name with extension to corresponding file (*src/constants/$FILENAME.ts*):

````
{
  title: string,
  ...,
  image: string 
}
````

**Example:**

````
{
  title: "Known problems of ERC-20 standard",
  ...,
  image: "image1.png"
}
````

where image1.png is stored in *public/images/articles*

Image will be added to card as background with overlay with 90% opacity.

You can change opacity in *src/components/Article/Article.module.scss* file by modifying 
$image-overlay-opacity varible (0-1 values, 0 - image showed without overlay, 1 - overlay will totally cover image)

Example: 

````
$image-overlay-opacity: 0.95; // the image will darken more
````

or

````
$image-overlay-opacity: 0.7; // the image will darken less
````

<h3>Default image</h3>

If no image provided for article, the default image will be applied to card. 

If you want to change the default image for card, replace **default.png** 
image in following folder *public/images/articles/default.png*

<h2>New event</h2>

To add new Event Record:

- **Open** *src/constants/event.ts*

- **Add** new Object to array with following required fields:

````
{
  title: string,
  date: string,
  url: string,
}
````

**Example**:

````
{
  title: "Lorem ipsum dolor sit amet.",
  url: "https://dexaran820.medium.com/known-problems-of-erc20-token-standard-e98887b9532c",
  date: "10.08.2024"
}
````

New card will appear in events list.

<h2>Deployment</h2>

To deploy changes simply push changes to master branch. Any push to master branch
will trigger github action, that will build app and push it to *public* branch. 

Github Action configuration stored under following path: *.github/workflows/node.js.yml*

If there are any problems with deployment, check following repository settings: 

- Settings > Pages > Build and deployment:

    - Source should be "Deploy from branch"
    - Branch should be "public"
    

- Settings > Actions > General > Workflow permissions

    - Check that "Allow Github Actions to create and approve pull requests" checkbox is enabled 
    
If settings are okay but there are still some issues with deployment, please contact developer to investigate the issue.
