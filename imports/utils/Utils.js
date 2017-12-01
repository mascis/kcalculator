export const Utils = {
		
		inArray( arr, value ) {
	        	
			if ( !arr ) {
				return false;
			} 
			
	        let i = 0;
	        
	        while( i < arr.length ) {
	        	
	            if ( arr[i] == value ) {
	                
	                return true;
	                
	            }
	            
	            i++;
	        }
	        
	        return false;
	        
	    },
	    
	    findIndex( arr, object ) {
	    		    	
	    	let i = 0;
            while( i < arr.length ) {
                
                if ( arr[i].index == object.index && arr[i].prop == object.prop ) {
                    return i;
                }
                
                i++;
            }
            
            return -1;
	    	
	    },
	    
	    round( value, decimals ) {
	    	
	    	if ( value < 0.1 ) {
	    		
	    		return value.toFixed( 3 );
	    		
	    	} else {
	    		
	    		return Number( ( Math.round( value + "e" + decimals )  + "e-" + decimals ) );
	    		
	    	}
	    	
	    },
	    
	    removeWhitespaces( str ) {
	    	    	
	    	return str.replace(/\s+/g,' ').trim();
	    	
	    }
	    
};

