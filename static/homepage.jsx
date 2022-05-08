function Homepage() {
    return (
      <React.Fragment>
        <h1>MiceTrack</h1>
        {/* <input type="submit" value="Track new mice" /> */}
        
        <form action="/track-mice" method="POST">
          <h2>Female mice info</h2>
          <label htmlFor="mating-date">Mating date</label>
          <input type="date" id="mating-date" name="mating-date" /><br/>

          <label htmlFor="days-in-breeding">Days in breeding</label>
          <input type="text" id="days-in-breeding" name="days-in-breeding"/><br/>

          <label htmlFor="need-check-pregnancy">Need to check pregnancy?</label>
          <input type="checkbox" id="need-check-pregnancy" name="need-check-pregnancy"/><br/>

          <label htmlFor="check-if-pregnant">Check if pregnant</label>
          <input type="checkbox" id="check-if-pregnant" name="check-if-pregnant"/><br/>

          <h2>Pups info</h2>

          <label htmlFor="pups-stain">Pups stain</label>
          <select name="pups-stain" id="pups-stain">
            <option value="WT">WT</option>
          </select><br/>

          <label htmlFor="date-of-birth">Date of birth</label>
          <input type="date" id="date-of-birth" name="date-of-birth"/><br/>

          <label htmlFor="days-old">Days old</label>
          <span id="days-old">123</span><br/>

          <label htmlFor="wean-date">WEAN date</label>
          <span id="wean-date">11-09-2020</span><br/>

          <label htmlFor="need-to-id">Need to id</label>
          <input type="checkbox" id="need-to-id" name="need-to-id"/><br/><br/>

          <input type="submit" value="Create" />

        </form>
      </React.Fragment>
    );
  }

ReactDOM.render(<Homepage />, document.querySelector('#root'));
