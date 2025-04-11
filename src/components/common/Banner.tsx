import React from 'react'

const Banner = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen gap-5 p-16'>
            <div style={{
                boxShadow: "0px -140px 250px 0px #000000 inset",
                backgroundRepeat: "no-repeat"
            }} className='h-full w-[50%] p-5 bg-[url("/businesspeople-meeting-office-working.png")] bg-cover rounded-2xl overflow-hidden relative'>
                <div className={`flex flex-col h-full gap-3 justify-end`}>
                    <h2 className={`text-[48px] font-semibold capitalize`}>welcome to workhive!</h2>
                    <ul className='text-[16px] list-disc list-inside'>
                        <li>Employee Management: View detailed profiles, track performance, and manage attendance.</li>
                        <li>Performance Insights: Analyze team goals, progress, and achievements.</li>
                        <li>Attendance & Leaves: Track attendance patterns and manage leave requests effortlessly.</li>
                    </ul>
                </div>
            </div>
            <div className='w-[50%]'>
                {children}
            </div>
        </div>
    )
}

export default Banner