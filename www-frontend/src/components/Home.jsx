import './Home.css';
import cooking from '../assets/maintenance';

const HomePage = () => {
  return (
    <>
      <div className="home-title">Home</div>


      <div className="icon-container">
        <div className='maintenance-icon'>
          {cooking}
        </div>
          Sorry, this page is under construction.
      </div>
    </>
  );
}

export default HomePage;