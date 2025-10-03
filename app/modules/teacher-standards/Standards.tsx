import React from 'react';
import Filters from '@/app/components/common/Filters';
import Searchbar from '@/app/components/common/Searchbar';
import TeacherStandardIcon from '@/app/assets/icons/TeacherStandardIcon';
import StandardCard from './StandardCard';

function Standards() {
    return (
        <section>
            <Searchbar
                headerText="Learning Standards"
                tagline="Here’s All Your Learning Standards"
                Icon={TeacherStandardIcon}
            />
            <Filters text="40 Learning Plans In Total" />
            <StandardCard />
        </section>
    );
}

export default Standards;
