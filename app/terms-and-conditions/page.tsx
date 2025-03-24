
export const metadata = {
	title: "Terms and Conditions",
	description:
		"Terms and conditions for using MedCare Hub's telemedicine services",
};

export default function TermsAndConditions() {
	return (
		<div className='max-w-6xl mx-auto px-4 py-16'>
			<div className='mb-12 text-center'>
				<h1 className='text-4xl font-bold text-primary mb-4'>
					Terms and Conditions
				</h1>
				<div className='w-20 h-1 bg-primary mx-auto rounded-full'></div>
				<p className='mt-4 text-muted-foreground'>
					Last updated:{" "}
					{new Date().toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</p>
			</div>

			<div className='prose prose-slate dark:prose-invert max-w-none'>
				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							1
						</span>
						Acceptance of Terms
					</h2>
					<p className='text-muted-foreground'>
						By accessing and using MedCare Hub&apos;s services, you agree to
						these terms and conditions. If you do not agree with any part of
						these terms, please do not use our services.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							2
						</span>
						Service Description
					</h2>
					<p className='text-muted-foreground'>
						MedCare Hub provides telemedicine services connecting patients with
						healthcare providers. Our platform facilitates virtual
						consultations, appointment scheduling, and secure medical
						information exchange.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							3
						</span>
						User Responsibilities
					</h2>
					<ul className='list-none pl-0 mb-4 space-y-3'>
						<li className='flex items-start'>
							<span className=' w-5 h-5 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-xs mt-1'>
								✓
							</span>
							<span className='text-muted-foreground'>
								Provide accurate and complete information during registration
								and consultations
							</span>
						</li>
						<li className='flex items-start'>
							<span className=' w-5 h-5 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-xs mt-1'>
								✓
							</span>
							<span className='text-muted-foreground'>
								Maintain the confidentiality of your account credentials
							</span>
						</li>
						<li className='flex items-start'>
							<span className=' w-5 h-5 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-xs mt-1'>
								✓
							</span>
							<span className='text-muted-foreground'>
								Use the service only for legitimate medical purposes
							</span>
						</li>
						<li className='flex items-start'>
							<span className=' w-5 h-5 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-xs mt-1'>
								✓
							</span>
							<span className='text-muted-foreground'>
								Not engage in any activity that may disrupt the service
							</span>
						</li>
					</ul>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							4
						</span>
						Medical Disclaimer
					</h2>
					<p className='text-muted-foreground'>
						The information provided through our service is for general
						informational purposes only. It is not a substitute for professional
						medical advice, diagnosis, or treatment.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							5
						</span>
						Payment Terms
					</h2>
					<p className='text-muted-foreground'>
						Users agree to pay all fees associated with the services. Payments
						are processed securely through our approved payment providers.
						Refunds are subject to our refund policy.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							6
						</span>
						Privacy
					</h2>
					<p className='text-muted-foreground'>
						Your use of our service is also governed by our Privacy Policy. By
						using our service, you consent to our collection and use of
						information as detailed in the Privacy Policy.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							7
						</span>
						Termination
					</h2>
					<p className='text-muted-foreground'>
						We reserve the right to terminate or suspend access to our service
						immediately, without prior notice or liability, for any reason.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							8
						</span>
						Changes to Terms
					</h2>
					<p className='text-muted-foreground'>
						We reserve the right to modify these terms at any time. We will
						notify users of any material changes through our platform.
					</p>
				</div>

				<div className='bg-card p-8 rounded-lg shadow-sm border mb-8'>
					<h2 className='text-2xl font-semibold text-primary mb-4 flex items-center'>
						<span className=' w-8 h-8 bg-primary/10 text-primary rounded-full mr-3 flex items-center justify-center text-sm'>
							9
						</span>
						Contact Information
					</h2>
					<p className='text-muted-foreground'>
						For questions about these Terms and Conditions, please contact our
						support team at{" "}
						<a
							href='mailto:support@medcarehub.com'
							className='text-primary hover:underline'
						>
							support@medcarehub.com
						</a>
						.
					</p>
				</div>
			</div>

			<div className='mt-12 pt-8 border-t text-center text-sm text-muted-foreground'>
				<p>© {new Date().getFullYear()} MedCare Hub. All rights reserved.</p>
			</div>
		</div>
	);
}
