import Link from "next/link";

import HeritageImage from "@/components/ui/HeritageImage";

const projects = [
  {
    title: "K-Care",
    subtitle: "KUPEXSA Compassionate Arm",
    description:
      "An educational support initiative helping bright but financially vulnerable students access quality education at Presbyterian High School, Kumba.",
    href: "/projects/k-care",
    image: "/images/projects/k-care-card.png",
    status: "Active Project",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            KUPEXSA Projects
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Projects that strengthen our school and community
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Explore KUPEXSA initiatives created to support students, preserve
            our shared legacy and turn alumni compassion into measurable impact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Current Initiatives
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950 sm:text-4xl">
            Making a difference, one project at a time
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            Each project card opens a dedicated page containing its purpose,
            structure, participation opportunities and accountability framework.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <HeritageImage
                src={project.image}
                alt={`${project.title} project`}
                label={`${project.title} Project Photograph`}
                className="aspect-[16/10]"
              />

              <div className="p-7">
                <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-yellow-800">
                  {project.status}
                </span>

                <h2 className="mt-5 text-3xl font-bold text-blue-950">
                  {project.title}
                </h2>

                <p className="mt-2 font-semibold text-yellow-700">
                  {project.subtitle}
                </p>

                <p className="mt-5 leading-7 text-gray-600">
                  {project.description}
                </p>

                <Link
                  href={project.href}
                  className="mt-7 inline-flex rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Explore Project
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-50 px-6 py-12 text-center sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            More Projects
          </p>

          <h2 className="mt-4 text-3xl font-bold text-blue-950">
            New KUPEXSA initiatives will appear here
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            This Projects page is ready to receive additional project cards as
            new KUPEXSA programmes are approved and launched.
          </p>
        </div>
      </section>
    </main>
  );
}