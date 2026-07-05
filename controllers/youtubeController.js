exports.getSearchSuggestion = async (req, res) => {
    try {
        const query = req.query.query;
        const response = await fetch(`https://suggestqueries-clients6.youtube.com/complete/search?ds=yt&hl=en-gb&gl=in&client=youtube&gs_ri=youtube&sugexp=ytdesce_cd%2Cyteo.en%3D1%2Cyteo.enye%3D1%2Cyteo.ence%3D1%2Cyteo.fbse%3D1%2Cyteo.emd%3D1%2Cyteo.epse%3D1%2Cstarz.cnf%3Dkesem_on_youtube%2Cstar.cnf%3Dkesem_on_youtube%2Cyteo.ren%3D1&tok=-TECQfbznvHKNB3O_47r7Q&h=180&w=320&ytvs=1&gs_id=5&q==${query}&cp=4`);

        const text = await response.text();
        const match = text.match(/window\.google\.ac\.h\((.+)\)/);
        if (match && match[1]) {
            const data = JSON.parse(match[1]);
            const suggestions = Array.isArray(data) && data[1] ? data[1].map(item => item[0]) : [];
            return res.status(200).json({
                status: "success",
                data: suggestions,
            })
        }

        return res.json([]);
    } catch (err) {
        console.log("Failed", err);

        return res.status(500).json({
            status: "failed",
            data: err.message
        })
    }
}

exports.getSearchedVideos = async (req, res) => {
    try {
        const searchedTerm = req.query.searchedTerm;
        const response = await fetch(``)


    } catch (err) {

    }
}
