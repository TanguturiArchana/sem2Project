
import React, { useState, useEffect } from 'react';

function QuestionPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch the JSON data
    fetch('./questions.json')
      .then(response => response.json())
      .then(data => setData(data.images[0])); // Assuming you want to load the first image initially
  }, []);

  return (
    <div>
      {data && (
        <div>
          <img src={data.url} alt={data.caption} />
          <p>{data.option1}</p>
          <p>{data.option2}</p>
          <p>{data.option3}</p>
          <p>{data.option4}</p>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;
