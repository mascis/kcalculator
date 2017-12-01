import {MONTHS} from '../ui/helpers/Months.js'; 

export const DateUtil = {
		
		isLeapYear(year) {
			
			return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
			
		},
		
		has30days( month ) {
			
			const months = [
				MONTHS.APRIL,
				MONTHS.JUNE,
				MONTHS.SEPTEMBER,
				MONTHS.NOVEMBER
				];
			
			for ( let i = 0; i < months.length; i++ ) {
				
				if ( month == months[i] ) {
					return true;
				}
				
			}
			
			return false;
			
		},
		
		has31days( month ) {
			
			const months = [
				MONTHS.JANUARY, 
				MONTHS.MARCH, 
				MONTHS.MAY, 
				MONTHS.JULY, 
				MONTHS.AUGUST,
				MONTHS.OCTOBER,
				MONTHS.DECEMBER];
			
			for ( let i = 0; i < months.length; i++ ) {
				
				if ( month == months[i] ) {
					return true;
				}
				
			}
			
			return false;
			
		},
		
		isLastDayOfYear( day, month ){
			
			return day == 31 && month == 11;
			
		},
		
		isFirstDayOfYear( day, month ){
			
			return day == 1 && month == 0;
			
		},
		
	    getPrevDate( day, month, year ) {
			
			const d = new Date();
			
			if ( this.isFirstDayOfYear( day, month ) ) {
				
				d.setDate( 31 );
	    		d.setMonth( 11 );	    	
	    		d.setFullYear( year - 1 );

	    	} else if ( month == MONTHS.MARCH && day == 1 ) {
	    			
    			if ( this.isLeapYear( year ) ) {
	    			
	    			d.setFullYear( year );
	    			d.setDate( 29 );
		    		d.setMonth( month - 1 );
	    			
	    		} else {
	    			
	    			d.setFullYear( year );
	    			d.setDate( 28 );
		    		d.setMonth( month - 1 );
		    		
	    		}
	    		
	    	} else if ( day == 1 && this.has30days( month -1 ) ) {
	    		
	    		d.setFullYear( year );
	    		d.setMonth( month - 1 );
	    		d.setDate( 30 );
				
	    	} else if ( day == 1 && this.has31days( month -1 ) ) {
	    		
	    		d.setFullYear( year );
	    		d.setMonth( month - 1 );
	    		d.setDate( 31 );
	    						
			}  else {
				
				d.setFullYear( year );
				d.setMonth( month );
				d.setDate( day - 1 );
				
			}
			
			return d;
	    	
	    },
	    
	    getNextDate( day, month, year ) {
	    	
	    	const d = new Date();
	    	
	    	if ( this.isLastDayOfYear( day, month ) ) {
	    		
	    		d.setFullYear( year + 1 );
	    		d.setMonth( 0 );
	    		d.setDate( 1 );
	    		
	    	} else if ( ( this.has30days( month ) && day == 30 ) || ( this.has31days( month ) && day == 31 ) ) {
	    		
	    		d.setFullYear( year );
	    		d.setMonth( month + 1 );
	    		d.setDate( 1 );
	    		
	    	} else {
	    		
	    		d.setFullYear( year );
	    		d.setMonth( month );
	    		d.setDate( day + 1 );
	    		
	    	}	    	
	    	
	    	return d;
	    }
		
};

