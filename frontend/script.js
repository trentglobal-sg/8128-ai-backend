document.addEventListener("DOMContentLoaded", function(){
    const mapConfig = initMap(1.3521, 103.8198, "map");

    document.querySelector("#recommend-loading").style.visibility = "hidden";
    document.querySelector("#recommend-error").style.visibility = "hidden";

    document.querySelector("#recommendBtn")
        .addEventListener("click", async function(){
            const recommendTerms = document.querySelector("#recommendTerms").value;
            const center = mapConfig.map.getBounds().getCenter();
            const results = await recommend(center.lat, center.lng, recommendTerms);
           

            displayResults(mapConfig, results);
        
        });
})