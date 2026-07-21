import {
  SCHOOL_NAME,
  SCHOOL_MOTTO,
  KUPEXSA_SLOGAN,
  FOUNDATION_YEAR,
} from "@/lib/constants";


export default function Home() {

return (

<div>

<section className="bg-blue-950 text-white">

<div className="mx-auto max-w-7xl px-6 py-24">

<h1 className="text-5xl font-bold">
Connecting Kupexsans Worldwide
</h1>


<p className="mt-6 text-xl text-blue-100">
{SCHOOL_NAME}
</p>


<p className="mt-4 text-lg text-yellow-400">
{SCHOOL_MOTTO}
</p>


<button className="mt-8 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-blue-950">
Join KUPEXSA Connect
</button>


</div>

</section>



<section className="mx-auto max-w-7xl px-6 py-16">

<h2 className="text-3xl font-bold text-blue-950">
Our Legacy
</h2>


<p className="mt-4 max-w-3xl text-gray-600">

Established in {FOUNDATION_YEAR},
Presbyterian High School Kumba has produced
generations of Kupexsans united by service,
knowledge and integrity.

</p>


</section>



<section className="bg-gray-50 py-16">

<div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">


<div className="rounded-xl bg-white p-6 shadow">
<h3 className="text-3xl font-bold text-blue-900">
1963
</h3>
<p>
Years of Excellence
</p>
</div>


<div className="rounded-xl bg-white p-6 shadow">
<h3 className="text-3xl font-bold text-blue-900">
Global
</h3>
<p>
Kupexsans Worldwide
</p>
</div>


<div className="rounded-xl bg-white p-6 shadow">
<h3 className="text-3xl font-bold text-blue-900">
Proud
</h3>
<p>
To Belong
</p>
</div>


</div>

</section>


</div>

);

}