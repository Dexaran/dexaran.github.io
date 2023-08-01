export type IArticle = {
  title: string,
  url: string,
  description: string,
  image?: string
}

export type IRecentEvent = {
  title: string,
  url: string,
  date: string
}

export type IResourceTab = "articles" | "erc223" | "dev-sources";
