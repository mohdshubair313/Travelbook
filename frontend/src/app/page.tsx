import OLXScraper from "@/components/OlxScrapper";
import Categories from "../components/Categories";

export default function Home() {
  return (
    <div>
      <Categories />
      <OLXScraper />
    </div>
  );
}
