import { SearchForm } from '@/components/component/SearchForm';

const FlightSearchPage: React.FC = () => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flight Search</h1>
      <SearchForm  />
      
    </div>
  );
};


export default FlightSearchPage;