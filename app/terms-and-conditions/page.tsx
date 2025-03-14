export const metadata = {
	title: "Terms and Conditions | MedCare Hub",
	description:
		"Terms and conditions for using MedCare Hub's telemedicine services",
};

export default function TermsAndConditions() {
	return (
		<div className='container max-w-4xl py-12'>
			<h1 className='text-3xl font-bold mb-8'>Terms and Conditions</h1>

			<div className='prose prose-slate dark:prose-invert max-w-none'>
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>
						1. Acceptance of Terms
					</h2>
					<p>
						By accessing and using MedCare Hub's services, you agree to these
						terms and conditions. If you do not agree with any part of these
						terms, please do not use our services.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>
						2. Service Description
					</h2>
					<p>
						MedCare Hub provides telemedicine services connecting patients with
						healthcare providers. Our platform facilitates virtual
						consultations, appointment scheduling, and secure medical
						information exchange.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>
						3. User Responsibilities
					</h2>
					<ul className='list-disc pl-6 mb-4'>
						<li>
							Provide accurate and complete information during registration and
							consultations
						</li>
						<li>Maintain the confidentiality of your account credentials</li>
						<li>Use the service only for legitimate medical purposes</li>
						<li>Not engage in any activity that may disrupt the service</li>
					</ul>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>4. Medical Disclaimer</h2>
					<p>
						The information provided through our service is for general
						informational purposes only. It is not a substitute for professional
						medical advice, diagnosis, or treatment.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>5. Payment Terms</h2>
					<p>
						Users agree to pay all fees associated with the services. Payments
						are processed securely through our approved payment providers.
						Refunds are subject to our refund policy.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>6. Privacy</h2>
					<p>
						Your use of our service is also governed by our Privacy Policy. By
						using our service, you consent to our collection and use of
						information as detailed in the Privacy Policy.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>7. Termination</h2>
					<p>
						We reserve the right to terminate or suspend access to our service
						immediately, without prior notice or liability, for any reason.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>8. Changes to Terms</h2>
					<p>
						We reserve the right to modify these terms at any time. We will
						notify users of any material changes through our platform.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>
						9. Contact Information
					</h2>
					<p>
						For questions about these Terms and Conditions, please contact our
						support team.
					</p>
				</section>
			</div>
		</div>
	);
}
