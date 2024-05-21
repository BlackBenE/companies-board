import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import "../styles/company.css";

const SingleCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  domains: z.array(z.string()),
});

const CompanySchema = z.array(SingleCompanySchema);

const GET_COMPANIES_URL = "http://localhost:3000/companies";

type Company = { name: string; domains: string[]; id: string };

function companiFromServer(json: unknown): Company[] | null {
  const parsed = CompanySchema.safeParse(json);
  if (parsed.success) {
    return parsed.data.map((data) => ({
      name: data.name,
      domains: data.domains,
      id: data.id,
    }));
  } else {
    return null;
  }
}

export const Route = createFileRoute("/")({
  component: () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    useEffect(() => {
      fetch(GET_COMPANIES_URL)
        .then((response) => response.json())
        .then((data) => {
          const parsedData = companiFromServer(data);
          if (parsedData) {
            setCompanies(parsedData);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    return (
      <div>
        {companies.map((company) => (
          <div key={company.id} className="company">
            <h2>
              <Link to={`/company/${company.id}`} className="company-name">
                {company.name}
              </Link>
            </h2>
            <ul className="domain-list">
              {company.domains.map((domain) => (
                <li key={domain} className="domain-item">
                  {domain}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  },
});
