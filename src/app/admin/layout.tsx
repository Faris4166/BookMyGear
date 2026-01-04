import type { Metadata } from "next"; // เพิ่มการนำเข้า Metadata
import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css' // ตรวจสอบ Path ให้ถูกต้อง
import { Inter, Geist, Geist_Mono } from "next/font/google"; // รวมกลุ่มการนำเข้า Font
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar"

const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Booking System", // แก้ไขคำสะกดจาก Bokking
    description: "Booking system for resources",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                {/* รวม Font variables เข้าด้วยกันใน className */}
                <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Navbar />
                        <main>{children}</main>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}