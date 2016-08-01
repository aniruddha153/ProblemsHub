
	var probWrapperRowClone = probWrapperRow.clone();
	if(index === 0 || index === 3 || index === 6 ){
		$(".container").append(probWrapperRowClone);
	}


function setLikeCount(settings, buttonId){
	var currLikeCount = localStorage.getItem(settings.likeCount) ? localStorage.getItem(settings.likeCount) : 0;
	settings.likeCount = ++currLikeCount;
	localStorage.setItem(settings.likeCount,  JSON.stringify(settings.likeCount));
	$("#" + buttonId).find('.LikeCount').html(" " + settings.likeCount);
}


function setTotalLikeCount(problems){
	var totalLikeCount = parseInt(localStorage.getItem("totalLikeCount")) ? parseInt(localStorage.getItem("totalLikeCount")) : 0;
	$.each(problems, function(index, problem){
		if(problem.image === null) return;
		totalLikeCount += parseInt(localStorage.getItem("Like_" + problem.problemId));
	});
	localStorage.setItem("totalLikeCount", totalLikeCount);
	$(".TotalLikes").find(".badge").text(totalLikeCount);
}
