const pin = () => {
    let generatedPin = '';
    for (let i = 0; i < 4; i++) {
      generatedPin += Math.floor(Math.random() * 10);
    }
    return {generatedPin};
  };
export default pin;  