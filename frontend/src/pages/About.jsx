import React from 'react';

function About() {
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL + '/images/s7.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={backgroundStyle}>
      <div className="bg-black bg-opacity-60 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Framed Image */}
          <div className="flex justify-center mb-8">
            {/* (optional framed image section if needed) */}
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            About GOVT JUNIOR TECHNICAL SCHOOL KADRI
          </h2>

          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            GOVT JUNIOR TECHNICAL SCHOOL KADRI was established in 1965 and it is managed by the Department of Education
          </h3>

          {/* Main About Section */}
          <section className="text-gray-200 body-font">
            <div className="container mx-auto px-5 py-10 flex flex-col lg:flex-row items-center">
              {/* Image on the left */}
       <div className="lg:w-1/2 w-full mb-6 lg:mb-0 flex justify-center">
  <img
    src={`${process.env.PUBLIC_URL}/images/s11.png`}
    alt="School Building"
    className="w-[500px] h-[500px] object-cover rounded-lg shadow-none border-none bg-transparent"
  />
</div>



              {/* Text on the right */}
              <div className="lg:w-1/2 w-full lg:pl-12">
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white text-left">
                  Excellence in Education and Beyond
                </h1>
                <p className="mb-4 leading-relaxed">
                  Our school is committed to academic excellence and holistic development...
                </p>
                <p className="mb-4 leading-relaxed">
                  It is located in Urban area... academic session starts in April...
                   The school consists of Grades from 8 to 10. The school is Co-educational and it doesn't have an attached pre-primary section. The school is N/A in nature and is not using school building as a shift-school. Kannada is the medium of instructions in this school. This school is approachable by all weather road. In this school academic session starts in April.
         The school has Government building. It has got 1 classrooms for instructional purposes. All the classrooms are in good condition. It has 2 other rooms for non-teaching activities. The school has a separate room for Head master/Teacher. The school has Pucca boundary wall. The school has have electric connection. The source of Drinking Water in the school is Hand Pumps and it is functional. The school has 1 boys toilet and it is functional. and 1 girls toilet and it is functional. The school has a playground. The school has a library and has 475 books in its library. The school does not need ramp for disabled children to access classrooms. The school has 1 computers for teaching and learning purposes and all are functional. The school is not having a computer aided learning lab. The school is Provided and Prepared in School Premises providing mid-day meal.
                </p>

                <div className="flex mt-6">
                   <a href="/Admissions">
                  <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
                    Admission
                  </button>
                  </a>
                  <a href="/contact">
                    <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 hover:bg-gray-200 rounded text-lg">
                      Contact Us
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Highlights Section */}
          <section className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Our Facilities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
              {[
                { title: "Library", desc: "Thousands of books and e-resources." },
                { title: "Science Labs", desc: "Well-equipped modern labs." },
                { title: "Sports Grounds", desc: "Football, cricket, basketball and more." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow text-center text-gray-800">
                  <h3 className="text-xl font-semibold text-blue-700">{item.title}</h3>
                  <p className="mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
