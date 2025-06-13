export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white px-6 py-4 mt-auto">
            <div className="max-w-7xl mx-auto text-center">
                &copy; {new Date().getFullYear()} MyApp. All rights reserved.
            </div>
        </footer>
    );
}