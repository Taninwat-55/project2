import Nav from "@/app/components/Nav";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Nav />
            {children}
        </>
    );
}
