import "../styles/CompanyDetail.css";
import { createFileRoute, defaultSerializeError } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/company/$id")({
  component: CompanyDetail,
  loader: loadCompanyData,
});

const DetailCompanySchema = z.object({
  name: z.string(),
  description: z.string(),
  website: z.string(),
  domains: z.array(z.string()),
});

async function loadCompanyData(arg: { params: { id: string } }): Promise<any> {
  const response = await fetch(
    `http://localhost:3000/company/${arg.params.id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch company data");
  }
  return await response.json();
}

function CompanyDetail() {
  const company = Route.useLoaderData();
  return (
    <div className="company-detail">
      <h2>{company.name}</h2>
      <section>
        <h3>Description</h3>
        <p>{company.description}</p>
      </section>
      <section>
        <h3>Website</h3>
        <p>
          <a href={company.website}>{company.website}</a>
        </p>
      </section>
      <section>
        <h3>Domains</h3>
        <ul>
          {company.domains.map((domain: string) => (
            <li key={domain} className="domain-badge">
              {domain}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
