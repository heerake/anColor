//var anColor = (function(){
	var maxDeep = 10
	 	, kCount = 512
	 	, rgbs = []
	 	, kSets = []
	 	, group = {}
	 	, precision = 0.9
	 	, start
	function LoadImage(src){
		start = +new Date()
		var img = new Image()
		img.src = src
		img.crossOrigin = "Anonymous";
		img.addEventListener('load', function(){
			console.log(+new Date() - start)
			start = +new Date()
			InitCanvas(this)
			//console.log(+new Date() - start)
		}, false)
	}

	function InitCanvas(img){
		window.i = img
		var canvas = document.body.appendChild(document.createElement('canvas')), ctx, imageData
		canvas.height = img.height
		canvas.width = img.width
		ctx = canvas.getContext('2d')
		ctx.drawImage(img, 0, 0)

		imageData = ctx.getImageData(0, 0, img.width, img.height)

		for(var i = 0, length = imageData.data.length / 4; i < length; i++){
			var index = i * 4
			rgbs.push([imageData.data[index], imageData.data[index+1], imageData.data[index+2]])
		}

		StartKMeans()
	}

	function StartKMeans(){
		// for(var i = 0; i < kCount; i++){
		// 	var index = parseInt(Math.random() * rgbs.length)
		// 	var kSet = [rgbs[index][0], rgbs[index][1], rgbs[index][2]]
		// 	kSet.sets = []
		// 	kSets.push(kSet)
		// }
		for(var i = 0; i < 256 ; i+= 85){
			for(var j = 0; j < 256 ; j+= 85){
				for(var k = 0; k < 256 ; k+= 85){
					var kSet = [i, j ,k]
					kSet.sets = []
					kSets.push(kSet)
				}
			}	
		}

		var lastMaxSet
		console.log(+new Date() - start)
		start = +new Date()
		var count =0;
		while(maxDeep--){
			for(var i = 0; i <  kSets.length; i++){
				kSets[i].sets = []
			}

			for(var i = 0; i < rgbs.length; i++){
				FindMinSet(rgbs[i]).sets.push(rgbs[i])
			}
			console.log('minend: ' + (+new Date() - start))
			start = +new Date()

			//console.log(kSets.length)
			for(var i = 0; i < kSets.length; i++){
				var newSet = [0, 0, 0]
				for(var j = 0; j < kSets[i].sets.length; j++){
					count++
					newSet[0] += kSets[i].sets[j][0]
					newSet[1] += kSets[i].sets[j][1]
					newSet[2] += kSets[i].sets[j][2]
				}

				kSets[i][0] = parseInt(newSet[0] / kSets[i].sets.length)
				kSets[i][1] = parseInt(newSet[1] / kSets[i].sets.length)
				kSets[i][2] = parseInt(newSet[2] / kSets[i].sets.length)
			}

			console.log('fenzuu: ' + (+new Date() - start))
			start = +new Date()

			var maxSet = GetMaxSet()
			if(lastMaxSet)
				if(IsSameArr(maxSet, lastMaxSet))
					break
			
			lastMaxSet = CloneArr(maxSet)

			if(maxDeep){
				RemoveZeroSet()
				ReductSet(lastMaxSet)
			}
				
		}
		console.log(maxDeep)
		console.log(count)
		console.log(lastMaxSet)
		console.log('rgb(' + lastMaxSet[0] +', ' + lastMaxSet[1] +', ' + lastMaxSet[2] +')')
	}

	function CloneArr(arr){
		return arr.map(function(i){return i})
	}

	function GetMaxSet(){
		var maxIndex, maxValue = 0;
		for(var i = 0; i < kSets.length; i++){
			if(kSets[i].sets.length > maxValue){
				maxValue = kSets[i].sets.length
				maxIndex = i
			}
		}
		return kSets[maxIndex];
	}

	function FindMinSet(rgb){
		var minSet, minValue = 195075
		for(var i = 0; i < kSets.length; i++){
			var dist = GetDist(rgb, kSets[i])
			if(dist < minValue){
				minSet = kSets[i]
				minValue = dist
			}
		}

		return minSet
	}

	function GetDist(rgb, set){
		var val = 0
		for(var i = 0 ; i < rgb.length; i++){
			val += Math.pow(rgb[i] - set[i], 2)
		}
		return val
	}

	function GetMainColor(src){
		LoadImage(src)
	}

	function IsSameArr(arr1, arr2){
		if(arr1.length != arr2.length)
			return false
		for(var i = 0; i < arr1.length; i++){
			if(arr1[i] !== arr2[i])
				return false
		}

		return true
	}

	function RemoveZeroSet(){
		kSets = kSets.filter(function(i){return i.sets.length})
	}

	function ReductSet(maxSet){
		if(precision < 1){
			kSets.sort(function(i){
				return -GetDist(maxSet, i)
			})
			kSets.length = parseInt(precision * kSets.length)
		}
	}

	anColor = GetMainColor
	//return GetMainColor
//})();
//window.anColor = anColor