import SignInForm from '../_components/SignInForm'
import Toaster from '../../../components/ui/Toaster'

export default function SignInPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
			<div className="w-full max-w-md">
				<SignInForm />
			</div>
			<Toaster />
		</div>
	)
}
