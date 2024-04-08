import { configs } from "./config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-start">
      {Object.values(configs).map((config) => {
        return (
          <Link href={`/${config.name}`} key={config.name}>
            {config.name}
          </Link>
        );
      })}
    </div>
  );
}
