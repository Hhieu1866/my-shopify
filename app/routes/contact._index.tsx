import {Clock, Mail, MapPin} from 'lucide-react';
import {FormEvent, useState} from 'react';
import {ActionFunctionArgs} from 'react-router';

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();

  //   submit actual form data to server and send email
  await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay
  return {ok: true};
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';
type InquiryType = 'general' | 'bespoke';

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState<FormState>('idle');
  const [inquiryType, setInquiryType] = useState<InquiryType>('general');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // handle form submission
      setFormStatus('success');
    } catch (error) {
      // error in submitting
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      {/* hero section */}
      <section className="bg-brand-navy px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 font-playfair text-2xl text-white md:text-3xl">
              Connect with Us
            </h1>
            <p className="mx-auto max-w-7xl font-source text-lg text-brand-cream md:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              voluptatem corrupti provident sapiente eaque cumque?
            </p>
          </div>
        </div>
      </section>

      {/* contact information section */}
      <section className="bg-brand-cream px-4 py-16">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="bg-white p-8 text-center">
              <MapPin className="mx-auto mb-4 size-6 text-brand-gold" />
              <h3 className="mb-3 font-playfair text-xl text-brand-navy">
                Visit Us
              </h3>
              <p className="font-source text-brand-navy/70">
                Lorem ipsum dolor sit amet. <br />
                Lorem ipsum dolor sit amet. <br />
                Lorem, ipsum.
              </p>
            </div>
            <div className="bg-white p-8 text-center">
              <Clock className="mx-auto mb-4 size-6 text-brand-gold" />
              <h3 className="mb-3 font-playfair text-xl text-brand-navy">
                Atelier Hours
              </h3>
              <p className="font-source text-brand-navy/70">
                Monday - Friday <br />
                10:00 AM - 6:00 PM EST
                <br />
                Call any time
              </p>
            </div>
            <div className="bg-white p-8 text-center">
              <Mail className="mx-auto mb-4 size-6 text-brand-gold" />
              <h3 className="mb-3 font-playfair text-xl text-brand-navy">
                Contact
              </h3>
              <p className="font-source text-brand-navy/70">
                hieuuhtwork@gmail.com <br />
                +84 123 456 789 <br />
                Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* contact form section */}
      <section className="bg-white px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl">
            {/* form title */}
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-playfair text-3xl text-brand-navy md:text-4xl">
                Get in Touch
              </h2>
              <p className="font-source text-brand-navy/70">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Quidem, at.
              </p>
            </div>

            {/* contact form */}
            <form action="" onSubmit={handleSubmit} className="space-y-6">
              {/* inquiry type */}
              <div className="grid grid-cols-2 gap-0">
                <button
                  type="button"
                  onClick={() => setInquiryType('general')}
                  className={`p-4 text-center font-source transition-colors ${
                    inquiryType === 'general'
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-cream text-brand-navy hover:bg-brand-navy/10'
                  }`}
                >
                  General Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('bespoke')}
                  className={`p-4 text-center font-source transition-colors ${
                    inquiryType === 'bespoke'
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-cream text-brand-navy hover:bg-brand-navy/10'
                  }`}
                >
                  Bespoke Services
                </button>
              </div>
              {/* form fields */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="mb-4">
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full border p-2"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full border p-2"
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border p-2"
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm text-gray-700"
                  >
                    Phone Number (Optional)
                  </label>
                  <input type="tel" id="phone" className="w-full border p-2" />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full border p-2 py-16"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-brand-navy py-4 font-source tracking-wide text-white transition-colors hover:bg-brand-navyLight disabled:bg-brand-navy/50"
                  >
                    {formStatus === 'submitting'
                      ? 'Sending...'
                      : 'Send Message'}
                  </button>
                </div>

                {formStatus === 'success' && (
                  <div className="text-center font-source text-brand-navy/70 md:col-span-2">
                    Thank you for your message. We will be in touch shortly.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="text-center font-source text-red-600/70 md:col-span-2">
                    There was an error sending your message. Please try again.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* bes */}
      <section className="bg-brand-cream px-4 py-16">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-4 font-playfair text-2xl text-brand-navy md:text-3xl">
              Bespoke Services
            </h3>
            <p className='font-source text-brand-navy/70'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Doloribus quidem voluptatum dolore excepturi sapiente laborum, sed
              cum, voluptatibus id eos nisi vitae quasi eligendi quam.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
