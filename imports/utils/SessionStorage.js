export const SessionStorage = {
		
		setItem( name, value ) {
			
			sessionStorage.setItem(name, JSON.stringify(value));

	    },
	    
	    getItem( name ) {
	    	
	    	return sessionStorage.getItem(name);
	    	
	    },
	    
	    removeItem( name ) {
	    	
	    	sessionStorage.removeItem(name);
	    	
	    }
	    
};

