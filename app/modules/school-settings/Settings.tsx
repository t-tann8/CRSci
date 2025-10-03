import React from 'react';
import Searchbar from '@/app/components/common/Searchbar';
import Profile from '../setting/Profile';
import SchoolProfile from '../setting/SchoolProfile';

function Settings() {
    return (
        <section className=" px-3 lg:px-8">
            <Searchbar headerText="Settings" tagline="Manage Your Profile" />
            <div className="flex flex-col space-y-8  lg:flex-row lg:justify-between w-full lg:space-x-8 lg:mt-5 ">
                <Profile isSchoolProfile />
                <hr className="my-4 lg:hidden" />
                {/* <SchoolProfile /> */}
            </div>
        </section>
    );
}

export default Settings;
