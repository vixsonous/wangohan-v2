import {Metadata} from "next";

type Props = {
  params: Promise<{
    searchText: string;
  }>;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const searchParams = await params;

  return {
    title: "Search " + decodeURI(searchParams.searchText)
  }
}

export default async function SearchPage({params}: Props) {

  const searchText = decodeURI((await params).searchText);
  return (
    <h1>This is the search page {searchText}</h1>
  )
}