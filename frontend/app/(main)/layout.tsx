import SiteHeader from "@/app/components/SiteHeader";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SiteHeader />
            {children}
        </>
    );
}
