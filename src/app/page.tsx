import { Button } from "@/components/ui/button"
import { LogIn, Stethoscope, UserPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">DocPrescribe</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-900 hover:text-blue-700">Home</Link>
            <Link href="/login">
              <Button variant="ghost" className="text-blue-900 hover:text-blue-700">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center mb-12">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome to DocPrescribe</h1>
            <p className="text-xl text-gray-700 mb-6">
              Streamline your prescription process with our easy-to-use digital platform.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3">
              Get Started
            </Button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/doc-pat.jpg?height=400&width=600"
              alt="Doctor using digital prescription system"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Image
              src="/images/doctors.jpg"
              alt="Doctor writing a digital prescription"
              width={400}
              height={600}
              className="rounded-lg mb-4 w-full "
            />
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">For Doctors</h2>
            <p className="text-gray-600 mb-4">Efficiently manage and issue prescriptions for your patients.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="  flex flex-row justify-around">
            <Image
              src="/images/patients.jpg"
              width={400}
              height={50}
              alt="Patient accessing prescription on mobile device"
              className="rounded-lg mb-4 w-full h-[58vh]"
            />
            </div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">For Patients</h2>
            <p className="text-gray-600 mb-4">Easily access and manage your prescriptions online.</p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Learn More</Button>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Why Choose DocPrescribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Secure", description: "Advanced encryption to protect patient data", icon: "🔒" },
              { title: "Efficient", description: "Save time with our streamlined prescription process", icon: "⚡" },
              { title: "Accessible", description: "Access prescriptions anytime, anywhere", icon: "🌐" },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 text-center py-6">
        <p className="text-gray-600">&copy; 2024 DocPrescribe. All rights reserved.</p>
      </footer>
    </div>
  )
}

