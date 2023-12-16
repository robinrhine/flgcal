sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("robinCalculationEngine.controller.View1", {
		
		
		onInit: function () {
			
			var sPath = jQuery.sap.getModulePath("robinCalculationEngine", "/model/Flights.json");
			var oModel = new JSONModel();
			oModel.loadData(sPath,true);
			console.log(oModel);
			this.getView().setModel(oModel);
			var that = this;
			jQuery.sap.delayedCall(1000, this, function() {
			    
				console.log(oModel.getData().special_airline_prices);
				
					var oViewModel = new sap.ui.model.json.JSONModel();
					that.getView().setModel(oViewModel, "oView");
					
					that.getView().getModel("oView").setProperty("/ApiFlightList",oModel.getData().flights_api_data);
					that.getView().getModel("oView").setProperty("/AgentList",oModel.getData().agent_list);
					that.getView().getModel("oView").setProperty("/OperationCountryList",oModel.getData().operating_countries);
					that.getView().getModel("oView").setProperty("/SpecialPricesList",oModel.getData().special_airline_prices);
					that.getView().getModel("oView").setProperty("/SensativeAirlineList",oModel.getData().special_airlines);
					that.getView().getModel("oView").setProperty("/IssuingAgentList",oModel.getData().ticket_issuet);
					that.getView().getModel("oView").setProperty("/AdminMarkUpList",oModel.getData().admin_markup);
					that.getView().getModel("oView").setProperty("/AITTaxList",oModel.getData().ait_taxes);
					that.getView().getModel("oView").setProperty("/PccAgentComissionList",oModel.getData().pcc_owner_commision);
					that.getView().getModel("oView").setProperty("/SegmentAmountList",oModel.getData().segment_calculations);
					that.onLoadTableforSpecialOffers();
					
					
				
			 });
			
			
			
			
		},
		onLoadTableforSpecialOffers:function(){
			var oTable = this.getView().byId("tableSpecialPrice"),
				oModel = new sap.ui.model.json.JSONModel(this.getView().getModel("oView").getProperty("/SpecialPricesList"));
    			oTable.setModel(oModel);
    			oTable.bindAggregation("items","oView>/SpecialPricesList",function(sId,oContext){

    				var oComponent ;
    				
    				var oOfferlist = oContext.getProperty("offers");
    				console.log(oOfferlist);
    				var oContorls = [];
    				
    				for(var i=0;i<oOfferlist.length;i++)
    				{
    					 var obj = oOfferlist[i];
    					 
    					 var oVBox = new sap.m.VBox();
    							oVBox.addItem(
    								
    									new sap.m.FlexBox({
    										direction:"Row",
    										alignItems:"Start", 
    										justifyContent:"Start",
    										items:[
    													new sap.m.ObjectStatus({
																		
																		text:obj.issuing_agent_name,
																		state:"None",
																		inverted:true
														}).addStyleClass("sapUiTinyMargin"),
														new sap.m.ObjectStatus({
																		
																		text:obj.discount+"%",
																		state:"None",
																		inverted:true
														}).addStyleClass("sapUiTinyMargin"),
														new sap.m.ObjectStatus({
																		
																		text:obj.ticket_type,
																		state:"None",
																		inverted:true
														}).addStyleClass("sapUiTinyMargin"),
														new sap.m.VBox({
															items:[
																	new sap.m.ObjectAttribute({
									    					 			title:"From",
									    					 			text:obj.outbound_city
									    					 		}),
									    					 		
									    					 		new sap.m.ObjectAttribute({
									    					 			title:"To",
									    					 			text:obj.inbound_city
									    					 		})
																]
														}).addStyleClass("sapUiTinyMarginBeginEnd"),
														new sap.m.VBox({
															items:[
																new sap.m.ObjectAttribute({
							    					 			title:"Valid From",
							    					 			text:obj.valid_from
								    					 		}),
								    					 		new sap.m.ObjectAttribute({
								    					 			title:"Valid To",
								    					 			text:obj.valid_to
								    					 		})
																
														]}).addStyleClass("sapUiTinyMarginBeginEnd")
						    					 		
						    					 		
    											]
    										
    									}).addStyleClass("sapUiTinyMarginBottom")
    								
		    					 		/*new sap.m.FlexBox({
														direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
		    					 			items:[
		    					 				    		new sap.m.ObjectStatus({
																		
																		text:obj.issuing_agent_name,
																		state:"None",
																		inverted:true
															}),
															
															new sap.m.ObjectStatus({
																		
																		text:obj.discount+"%",
																		state:"None",
																		inverted:true
															}),
															new sap.m.ObjectStatus({
																		
																		text:obj.ticket_type,
																		state:"None",
																		inverted:true
															}),
															new sap.m.ObjectAttribute({
						    					 			title:"From",
						    					 			text:obj.outbound_city
						    					 		}),
						    					 		
						    					 		new sap.m.ObjectAttribute({
						    					 			title:"To",
						    					 			text:obj.inbound_city
						    					 		})
		    					 				]
		    					 		}).addStyleClass("sapUiTinyMarginBottom")*/
		    					 		
		    					 		
		    					 		
    					 	
    					 	);
    					 	
    					 	oContorls.push(oVBox);
    					 	
    				}
    				
    				
    				return new sap.m.ColumnListItem({
										cells : 
										[
											
															
											new sap.m.Panel({
												headerText:"{oView>airline_name}-{oView>airline_code}",
												expandable:true,
												content:oContorls
											})

										]  // end of cells..
							    	});	
    				
    				
    			});
		},
		onChangeUser:function(oEvent){
			
			var okey = oEvent.getSource().getSelectedKey();
			this.onCalculatePrice(okey);
			
		},
		
		onCalculatePrice:function(Okey){
			
			var oApiFlightList = this.getView().getModel("oView").getProperty("/ApiFlightList"),
				oAgentList =  this.getView().getModel("oView").getProperty("/AgentList"),
				oAllowedCountryList = this.getView().getModel("oView").getProperty("/OperationCountryList"),
				oSpecailPriceList = this.getView().getModel("oView").getProperty("/SpecialPricesList"),
				oSensativeAirlineList = this.getView().getModel("oView").getProperty("/SensativeAirlineList"),
				oIssuingAgentList = this.getView().getModel("oView").getProperty("/IssuingAgentList");
				
				
				// now identifiy all this arilines can be operation base on logon user or IP address.
				// here assume that this operated from country bangladesh.
				
				
				//var Okey = this.getView().byId("CmbUser").getSelectedKey();
				var oUser = oAgentList.filter(function (agent) { return agent.agent_id === Okey ; })[0];
				console.log(oUser);
					
				
				var oUniquAirlines =[];
				var oUniqueFlightNo =[];
				var oFlightList = [];
				oApiFlightList.forEach(function(elm,index)
				{
					// get list of unique ailine list.
						var oAI = oUniquAirlines.findIndex(function(element,i)
						{
							return element ===  elm.airline_code;
						});
						
						if(oAI === -1){
							oUniquAirlines.push(elm.airline_code);
						}
						
						// get list of unique flight No list.
						var oFI = oUniqueFlightNo.findIndex(function(flight,i)
						{
							return flight.flight ===  elm.flight_no;
						});
						
						if(oAI === -1){
							var obj = {};
							obj.FlightNO = elm.flight_no;
							obj.AirlineCode = elm.airline_code;
							oUniqueFlightNo.push(obj);
						}
				});
				
				console.log(oUniquAirlines);
				console.log(oUniqueFlightNo);
				
				
				//find sensative airline code that allowed not every country to operate
				var that = this;
				var oDeletedAirlines =[];
				oUniquAirlines.forEach(function(elem,index){
						that.onfilterbyRareAirlineCode(elem,oUser.country_id,oSensativeAirlineList,function(bIndex)
						{
							if(bIndex === -1)
							{
								oDeletedAirlines.push(elem);
							}
						});
						
						//
				});
				
				console.log(oDeletedAirlines);
				
				// if found then remove it the sensative airline code.
				if(oDeletedAirlines.length > 0){
					
					var oDIndex, oAFlights = [];
					oDeletedAirlines.forEach(function(el,idx){
						oDIndex  = oUniquAirlines.map(function (obj) { return obj; }).indexOf(el);
						if(oDIndex !== -1){
							oUniquAirlines.splice(oDIndex,1);
						}
						
						//new get all array object from Unique Flights.
						oAFlights = oUniqueFlightNo.filter(function (x) { return x.AirlineCode !== el; })
						
						
					});
					oUniqueFlightNo = [];
					oUniqueFlightNo = oAFlights; 
					
				}
				
				
				//console.log(oUniquAirlines);
				//console.log(oUniqueFlightNo); 
				
				var oFlightAr_lowest_Price =[];
				oUniqueFlightNo.forEach(function(olm){
					
					that.onFindLowestPriceBaseonAirlineCode(olm.AirlineCode,olm.FlightNO,function(object)
						{
							object.Custom_Prices={};
							oFlightAr_lowest_Price.push(object);
						});
					
				});
				
				console.log(oFlightAr_lowest_Price);
				this.onFormattedList(oFlightAr_lowest_Price,oUser);
			
		},
		
		onFormattedList:function(olist,oUser){
			var oArr = []; var that = this;
			olist.forEach(function(elem)
			{
				  var obj ={};
				  obj = elem;
				  that.onCalculateAITTaxNewLogic(obj.price.base_price,oUser.country_id,obj,function(p)
				  {
							obj.Agent =oUser.agent_name;
							
							
							console.log(p);
							//p.ait_tax_amount ;
							//p.CostingPrice;
							//p.b.SpecialDisscountAmount;
							p.NoOfSegments = (obj.outbound.length + obj.inbound.length).toString();
							p.SegmentPrice = that.onCalculateSegmentAmount(obj.airline_code ,p.NoOfSegments,obj).TotalSegmentAmount;
							p.PerSegmentPrice = that.onCalculateSegmentAmount(obj.airline_code , p.NoOfSegments,obj).PerSegmentAmount;
							p.CostingPrice = ( parseFloat(p.CostingPrice) - parseFloat(p.SegmentPrice)).toString();
							p.AdminMarkUpPrice =that.onAdminMarkUp(p.CostingPrice);
							p.AgentPrice = ( parseFloat(p.AdminMarkUpPrice) + ( (parseFloat(p.AdminMarkUpPrice) * parseFloat(oUser.mark_up))/100 )).toFixed(2).toString();
							obj.Custom_Prices = p;
							
				  });
				  
				oArr.push(obj);
				
			});
			
			console.log(oArr);
			this.getView().getModel("oView").setProperty("/FormattedFlightList",oArr);
			this.onLoadTableForFlights();
		},
		
		onAdminMarkUp:function(price){
			 var amdinMarkUpPrice="";
			 var oAdminMarkUpList = this.getView().getModel("oView").getProperty("/AdminMarkUpList");
			 
			 var obj =  oAdminMarkUpList.filter(function(item){
			 		return  parseInt(price,10) > parseInt(item.min_range,10) &&  parseInt(price,10) < parseInt(item.max_range,10); 
			 });
			  console.log(obj[0].markup);
			  
			  //amdinMarkUpPrice =  (parseInt(price,10) + ((parseInt(price,10)* parseFloat(obj[0].markup))/100) ).toString();
			  amdinMarkUpPrice =  (parseFloat(price) + ((parseFloat(price)* parseFloat(obj[0].markup))/100) ).toFixed(2).toString();
			  return amdinMarkUpPrice
			
			
		},
		
		onFindLowestPriceBaseonAirlineCode:function(AirlineCode,FlightNo,fnCallback){
			
			var oApiFlightList = this.getView().getModel("oView").getProperty("/ApiFlightList");
			var object; var oFlist = [];
			oFlist = oApiFlightList.filter(function(oflight){
				   return oflight.airline_code === AirlineCode && oflight.flight_no === FlightNo;
			});
			
			if(oFlist.length > 0)
			{
				/*/	oFlist.sort((a, b) => {
				    	return parseInt(a.price.base_price,10) - parseInt(b.price.base_price,10);
					});*/
					
					oFlist.sort(function(a,b){
						return parseInt(a.price.base_price,10) - parseInt(b.price.base_price,10);
					});
			}
			fnCallback(oFlist[0]);	
		
		},                     
		
		onfilterbyRareAirlineCode:function(oAirlineCode,countryId,OList,fnCallback){
			var bIndex ;
			var oFilterList = OList.filter(function(data){
				return	data.airline_code === oAirlineCode;                         
			});
			if(oFilterList.length === 0)
			{
				var bIndex = 0;
				fnCallback(bIndex);
			}else{
				bIndex = oFilterList[0].allowed_countries.map(function (obj) { return obj.country_id; }).indexOf(countryId);
				fnCallback(bIndex);
			}
		},
		
		
		
		onCalculateAITTaxNewLogic:function(BasePrice,AgentCountryCode,obj,fnCallback)
		{
			var oAitTaxlist = this.getView().getModel("oView").getProperty("/AITTaxList");
			var ait_tax ; var that = this; var ait_tax_percentage;
			var b ={};
			// calcualte AIT Tax.
				var oFnList = oAitTaxlist.filter(function(off){
					   return off.country_id === AgentCountryCode;
				});
				if(oFnList.length > 0){
					ait_tax =parseFloat((parseFloat(BasePrice) * parseFloat(oFnList[0].ait_tax_amount))/100).toFixed(2);
					ait_tax_percentage = oFnList[0].ait_tax_amount.toString();
				}else{
					ait_tax = parseFloat("0.00").toFixed(2);
					ait_tax_percentage ="0.00";
				}
			b.ait_tax_amount = ait_tax.toString();
			b.ait_tax_percentage  = ait_tax_percentage;
			
			
			// call below funciton to any special offer exist or not
			this.onFindSpecailPriceByAirineCode(obj,function(m)
			{
				if(Object.keys(m).length > 0)  // Special commission per route exist
				{
					console.log(m);
					that.onCalcualteCommission(BasePrice,obj.airline_code,obj,function(oComm)
					{
						// need check which commision is bigger..
						// here disccount comming from two table data. One is from PCC agent commision and another is from special route dicscount table.
						
						if(parseFloat(m.discount) > parseFloat(oComm.CommissionPercentage)){
							b.SpecialDisscountPercentage = m.discount.toString();
							b.IssuingAgentname = m.SpecialOfferProvider;
						}else{
							b.SpecialDisscountPercentage = oComm.CommissionPercentage;
							b.IssuingAgentname = oComm.IssueingAgentProvider;
						}
						
						b.SpecialDisscountAmount =((parseFloat(BasePrice) * parseFloat(b.SpecialDisscountPercentage))/100).toFixed(2).toString();
						b.CostingPrice = ((parseFloat(BasePrice) + parseFloat(b.ait_tax_amount)) - parseFloat(b.SpecialDisscountAmount)).toFixed(2).toString();
						fnCallback(b);
						
					});
				}else{
					// //not found Special commission per route exist then get Special discount from Commission table.
					that.onCalcualteCommission(BasePrice,obj.airline_code,obj,function(oComm)
					{
						b.SpecialDisscountPercentage = oComm.CommissionPercentage;
						b.SpecialDisscountAmount = oComm.CommissionAmount;
						b.CostingPrice = ((parseFloat(BasePrice) + parseFloat(b.ait_tax_amount) ) -  parseFloat(b.SpecialDisscountAmount)).toFixed(2).toString();
						b.IssuingAgentname = oComm.IssueingAgentProvider;
						fnCallback(b);
					});
				}
			});
		},
		
		onFindSpecailPriceByAirineCode:function(obj,fnCallback){
			var oSPList = this.getView().getModel("oView").getProperty("/SpecialPricesList");
			var oFlist = []; var q ={};
			oFlist = oSPList.filter(function(oflight){
				   return oflight.airline_code === obj.airline_code;
			});
			
			if(oFlist.length === 0){
				fnCallback(q);
			}else{
				
				var offers = oFlist[0].offers.filter(function(offer){
					   return offer.outbound_city === obj.origin_airport && offer.inbound_city === obj.destination_airport && offer.ticket_type ===  obj.ticket_type && new Date(obj.departure_date) <= new Date(offer.valid_to);
					});
					
				if(offers.length === 0){
					fnCallback(q);
				}else{
					q.discount = offers[0].discount; 
					q.SpecialOfferProvider = offers[0].issuing_agent_name; 
					q.ProviderId = offers[0].issuing_agent_id;
					q.airline_code = obj.airline_code;
					fnCallback(q);
				}
			}
		},
		
		onCalcualteCommission:function(basePrice,airlineCode,obj,fnCallback){
			var oCommissionList = this.getView().getModel("oView").getProperty("/PccAgentComissionList");
			var oFList =[];
			var o= {};
			var oCommission="0.00";
			var oCommissionAmount ="0.00";
			var oAgentProvider="";
				// find which provider provide more commission based on Airline Code.
				oFList = oCommissionList .filter(function(offer){
					   return offer.airline_code === airlineCode && new Date(obj.departure_date) <= new Date(offer.valid_to);
				});
				if(oFList.length > 0)
				{
					//sort by descending order by Commision.
					/*oFList.sort((a, b) => {
					    	return parseFloat(b.commision) - parseFloat(a.commision);
						});*/
						
				    oFList.sort(function(a,b){
				    	return parseFloat(b.commision) - parseFloat(a.commision);
				    });
					
					
					oCommission = parseFloat(oFList[0].commision).toFixed(2);
					oAgentProvider = oFList[0].pcc_owner_name;
				}
				
			
			
				if(oCommission !== "0.00" )
				{
					oCommissionAmount =parseFloat((parseFloat(basePrice) * oCommission)/100 ).toFixed(2);
				}
				
				o.CommissionAmount = oCommissionAmount.toString();
				o.CommissionPercentage = parseFloat(oCommission).toFixed(2).toString(); 
				o.IssueingAgentProvider = oAgentProvider; 
				
				//fnCallback(oCommissionAmount.toString());
				fnCallback(o);
		},
		
		onCalculateSegmentAmount:function(airlineCode,totalSegment,obj){
				
			var osegmentAmountList = this.getView().getModel("oView").getProperty("/SegmentAmountList");
			var totalSegmentAmount = "0.00";
			var perSegmentAmout = "0.00";
			var oFList = osegmentAmountList .filter(function(offer){
					   return offer.airline_code === airlineCode && new Date(obj.departure_date) <= new Date(offer.valid_to);
				}); 
				
			if(oFList.length > 0){
				totalSegmentAmount = parseFloat( parseFloat(totalSegment) * parseFloat(oFList[0].segment_amount)).toFixed(2).toString();
				perSegmentAmout = parseFloat(oFList[0].segment_amount).toFixed(2).toString();
			}
			
			var s= {};
			s.TotalSegmentAmount =  totalSegmentAmount.toString();
			s.PerSegmentAmount =  perSegmentAmout;
			
			//return totalSegmentAmount;
			return s;
		},
		
		
		/* start */
				/*oAgentList =  this.getView().getModel("oView").getProperty("/AgentList"),
				oAllowedCountryList = this.getView().getModel("oView").getProperty("/OperationCountryList"),
				oSpecailPriceList = this.getView().getModel("oView").getProperty("/SpecialPricesList"),
				oSensativeAirlineList = this.getView().getModel("oView").getProperty("/SensativeAirlineList"),
				oIssuingAgentList = this.getView().getModel("oView").getProperty("/IssuingAgentList");*/
		onGetUser:function(){
				var oAgentList =  this.getView().getModel("oView").getProperty("/AgentList");
				var Okey = this.getView().byId("CmbUser").getSelectedKey();
				var oUser = oAgentList.filter(function (agent) { return agent.agent_id === Okey ; })[0];
				//console.log(oUser);
				return oUser;
				
		},
		onFindUniqueAirlineAndFights:function(){
			var oApiFlightList = this.getView().getModel("oView").getProperty("/ApiFlightList"); 
			var oUniquAirlines = [];
			var oUniqueFlightNo =[];
			var oUniqueFlightsAirlineOnly =[];
			var oUnique = {};
			oApiFlightList.forEach(function(elm,index)
				{
					// get list of unique ailine list.
						var oAI = oUniquAirlines.findIndex(function(element,i)
						{
							return element ===  elm.airline_code;
						});
						
						if(oAI === -1){
							oUniquAirlines.push(elm.airline_code);
						}
						// get list of unique Only Flights list.
						var oOFI = oUniqueFlightsAirlineOnly.findIndex(function(ele,k)
						{
							//return element ===  elm.flight_no;
							return ele.FlightNo ===  elm.flight_no && ele.AirlineCode ===  elm.airline_code ;
														
						});
						
						if(oOFI === -1){
							var j = {};
							j.FlightNo = elm.flight_no;
							j.AirlineCode = elm.airline_code;
							oUniqueFlightsAirlineOnly.push(j);
						}
						
						
						
						// get list of unique flight object No list.
						var oFI = oUniqueFlightNo.findIndex(function(flight,i)
						{
							return flight.FlightNo ===  elm.flight_no && flight.AilineCode ===  elm.airline_code 
														&& flight.ID === elm.ID && flight.PCC_Owner_ID ===  elm.pcc_owner_id;
						});
						
						if(oFI === -1){
							var obj = {};
							obj.ID= elm.ID;
							obj.FlightNo = elm.flight_no;
							obj.AirlineCode = elm.airline_code;
							obj.Pcc_Owner_Name = elm.pcc_owner;
							obj.Pcc_Owner_ID = elm.pcc_owner_id;
							oUniqueFlightNo.push(obj);
						} 
				});
			oUnique.UniqueAirlines = oUniquAirlines;
			oUnique.UniqueFlights = oUniqueFlightNo;
			oUnique.UniqueFlightsAirlineOnly =oUniqueFlightsAirlineOnly;
			return oUnique;
		},
		
		onFindUnAllowedAirlines:function(oUniquAirlines,oUser)
		{
				var oSensativeAirlineList = this.getView().getModel("oView").getProperty("/SensativeAirlineList");
				var that = this;
				var oDeletedAirlines =[];
				oUniquAirlines.forEach(function(elem,index){
						that.onfilterbyRareAirlineCode(elem,oUser.country_id,oSensativeAirlineList,function(bIndex)
						{
							if(bIndex === -1)
							{
								oDeletedAirlines.push(elem);
							}
						});
						
						//
				});
				
				return oDeletedAirlines;
		},
		onAddAitTax:function(BasePrice,AgentCountryCode){
			var oAitTaxlist = this.getView().getModel("oView").getProperty("/AITTaxList");
			var ait_tax ; var that = this; var ait_tax_percentage;
			var b ={};
			// calcualte AIT Tax.
				var oFnList = oAitTaxlist.filter(function(off){
					   return off.country_id === AgentCountryCode;
				});
				if(oFnList.length > 0){
					ait_tax =parseFloat((parseFloat(BasePrice) * parseFloat(oFnList[0].ait_tax_amount))/100).toFixed(2);
					ait_tax_percentage = oFnList[0].ait_tax_amount.toString();
				}else{
					ait_tax = parseFloat("0.00").toFixed(2);
					ait_tax_percentage ="0.00";
				}
			b.ait_tax_amount = ait_tax.toString();
			b.ait_tax_percentage  = ait_tax_percentage;
			
			return b;
		},
		onGetSegmentAmount:function(airlineCode,totalSegment,gds_Provider_id,obj){
				
			var osegmentAmountList = this.getView().getModel("oView").getProperty("/SegmentAmountList");
			var totalSegmentAmount = "0.00";
			var perSegmentAmout = "0.00";
			var oFList = osegmentAmountList .filter(function(offer){
					   return offer.airline_code === airlineCode && new Date(obj.departure_date) <= new Date(offer.valid_to)
						&& offer.gds_id === gds_Provider_id;
				}); 
				
			if(oFList.length > 0){
				totalSegmentAmount = parseFloat( parseFloat(totalSegment) * parseFloat(oFList[0].segment_amount)).toFixed(2).toString();
				perSegmentAmout = parseFloat(oFList[0].segment_amount).toFixed(2).toString();
			}
			
			var s= {};
			s.TotalSegmentAmount =  totalSegmentAmount.toString();
			s.PerSegmentAmount =  perSegmentAmout;
			
			//return totalSegmentAmount;
			return s;
		},
		
		onGetSpecailPriceByAirineCode:function(obj){
			var oSPList = this.getView().getModel("oView").getProperty("/SpecialPricesList");
			var oFlist = []; var q ={};
			oFlist = oSPList.filter(function(oflight){
				   return oflight.airline_code === obj.airline_code;
			});
			
			q.SpRouteDiscountPercentage ="0.00";
			q.SpRouteDiscountAmount ="0.00";
			q.SpRouteDiscountProviderName="";
			q.SpRouteDiscountProviderId="";
			
			if(oFlist.length === 0){
				//fnCallback(q);
				return q;
			}else{
				
				var offers = oFlist[0].offers.filter(function(offer){
					   return offer.issuing_agent_id === obj.pcc_owner_id && offer.outbound_city === obj.origin_airport && offer.inbound_city === obj.destination_airport && offer.ticket_type ===  obj.ticket_type && new Date(obj.departure_date) <= new Date(offer.valid_to);
					});
					
				if(offers.length === 0){
					//fnCallback(q);
					return q;
				}else{
					q.SpRouteDiscountPercentage = offers[0].discount; 
					q.SpRouteDiscountAmount = (parseFloat(obj.price.base_price)* parseFloat(offers[0].discount)/100).toFixed(2).toString(); 
					q.SpRouteDiscountProviderName = offers[0].issuing_agent_name; 
					q.SpRouteDiscountProviderId = offers[0].issuing_agent_id;
					//fnCallback(q);
					return q;
				}
			}
		},
		
		onGetCommission:function(obj){
			var oCommissionList = this.getView().getModel("oView").getProperty("/PccAgentComissionList");
			var oFList =[];
			var o= {};
			var oCommission="0.00";
			var oCommissionAmount ="0.00";
			var oAgentProviderName="";
			var oAgentProviderID="";
				// find which provider provide more commission based on Airline Code.
				oFList = oCommissionList .filter(function(offer){
					   return offer.airline_code === obj.airline_code && offer.pcc_owner_id === obj.pcc_owner_id && new Date(obj.departure_date) <= new Date(offer.valid_to);
				});
				if(oFList.length > 0)
				{
					//sort by descending order by Commision.
					/*oFList.sort((a, b) => {
					    	return parseFloat(b.commision) - parseFloat(a.commision);
						});*/
					
					oCommission = parseFloat(oFList[0].commision).toFixed(2);
					oAgentProviderName = oFList[0].pcc_owner_name;
					oAgentProviderID = oFList[0].pcc_owner_id;
				}
				
			
			
				if(oCommission !== "0.00" )
				{
					oCommissionAmount =parseFloat((parseFloat(obj.price.base_price) * oCommission)/100 ).toFixed(2);
				}
				
				o.CommissionAmount = oCommissionAmount.toString();
				o.CommissionPercentage = parseFloat(oCommission).toFixed(2).toString(); 
				o.CommissionProviderName = oAgentProviderName; 
				o.CommissionProviderID = oAgentProviderID; 
				
				return o;
				
				//fnCallback(oCommissionAmount.toString());
				//fnCallback(o);
		},
		
		
		onGetCostingPrice:function(Tax,disscoutAmmout,segmentAmount,basePrice)
		{
				
			return  ((parseFloat(basePrice) + parseFloat(Tax) ) -  (parseFloat(disscoutAmmout) + parseFloat(segmentAmount))).toFixed(2).toString();
		},
		
		onGetAdminMarkUp:function(price){
			 var adminMarkUpAmount="";
			  var adminMarkUpPercentage="";
			  var oMarkup ={};
			  oMarkup.adminMarkUpPercentage ="0.00";
			  oMarkup.adminMarkUpAmount ="0.00"
			 var oAdminMarkUpList = this.getView().getModel("oView").getProperty("/AdminMarkUpList");
			 
			 var objlist =  oAdminMarkUpList.filter(function(item){
			 		return  parseFloat(price) > parseFloat(item.min_range) &&  parseFloat(price) < parseFloat(item.max_range); 
			 });
			 // console.log(obj[0].markup);
			  
			  if(objlist.length > 0){
			  	 oMarkup.adminMarkUpPercentage = parseFloat(objlist[0].markup).toFixed(2).toString();
			  	 oMarkup.adminMarkUpAmount = (parseFloat(price) + ((parseFloat(price)* parseFloat(objlist[0].markup))/100) ).toFixed(2).toString();
			  }
				
			  return oMarkup;
			
			
		},
		
		onGetLowestPriceBaseonAirlineCode:function(AirlineCode,FlightNo,fnCallback){
			
			var oApiFlightList = this.getView().getModel("oView").getProperty("/FlightCostingList");
			
			var object; var oFlist = [];
			oFlist = oApiFlightList.filter(function(oflight){
				   return oflight.AirlineCode === AirlineCode && oflight.FlightNo === FlightNo;
			});
			
			if(oFlist.length > 0)
			{
				/*	oFlist.sort((a, b) => {
				    	return parseFloat(a.Custom_Objects.CostingPrice) - parseFloat(b.Custom_Objects.CostingPrice);
					});*/
					
					oFlist.sort(function(a,b){
							return parseFloat(a.Custom_Objects.CostingPrice) - parseFloat(b.Custom_Objects.CostingPrice);
					})
					
					fnCallback(oFlist[0]);
			}else{
				fnCallback({});
			}
			
		
		},      
		
		
		onAddPriceIndexedForBaseAiTTaxAndSegemnt:function(oArrays,AgentCountryCode){
			
			var oApiFlightList = this.getView().getModel("oView").getProperty("/ApiFlightList");
			var oNewAarray =[]; var that = this;
			
			oArrays.forEach(function(elem,index)
			{
					
					var obj = {};
					obj = elem;
					var op ={};
					var oFList = oApiFlightList .filter(function(oflight){
					   return oflight.airline_code === elem.AirlineCode && oflight.flight_no === elem.FlightNo && oflight.pcc_owner_id ===  elem.Pcc_Owner_ID;
					});
					
					if(oFList.length > 0)
					{
						op.BasePrice = oFList[0].price.base_price;
						op.NoOfSegments = (oFList[0].outbound.length + oFList[0].inbound.length).toString();
						op.GDS_Provider = oFList[0].gds_provider;
						op.GDS_Provider_ID = oFList[0].gds_id;
						
						// get Segments
						var s  = that.onGetSegmentAmount(elem.AirlineCode,op.NoOfSegments,op.GDS_Provider_ID,oFList[0]);
						op.PerSegmentAmout = s.PerSegmentAmount;
						op.TotalSegmentAmount = s.TotalSegmentAmount;
						// get Ait Tax
						var ait = that.onAddAitTax(op.BasePrice,AgentCountryCode);
						op.AitTax = ait.ait_tax_amount;
						op.AitTax_percentage  = ait.ait_tax_percentage; 
						// get Special Route Offers.
						var spRoute = that.onGetSpecailPriceByAirineCode(oFList[0]);
						op.SpRouteDiscountPercentage = spRoute.SpRouteDiscountPercentage; 
						op.SpRouteDiscountAmount = spRoute.SpRouteDiscountAmount; 
						//comment these below two lines for the time Being...
						//op.SpRouteDiscountProviderName = spRoute.SpRouteDiscountProviderName; 
						//op.SpRouteDiscountProviderId = spRoute.SpRouteDiscountProviderId;
						
						//get Commission
						//var comm = that.onGetCommission(op.BasePrice,elem.AirlineCode,oFList[0]);
						var comm = that.onGetCommission(oFList[0]);
						op.CommissionAmount = comm.CommissionAmount;
						op.CommissionPercentage =  comm.CommissionPercentage;
						
						
						if( parseFloat(op.SpRouteDiscountAmount) >  parseFloat(op.CommissionAmount) )
						{
							op.DisscountAmout = op.SpRouteDiscountAmount;
							op.DisscountPercentage = op.SpRouteDiscountPercentage;
						}else{
							op.DisscountAmout = op.CommissionAmount;
							op.DisscountPercentage = op.CommissionPercentage;
						}
						
						op.CostingPrice = that.onGetCostingPrice(op.AitTax,op.DisscountAmout,op.TotalSegmentAmount,op.BasePrice);
						
						var oAdmniMarkUp = that.onGetAdminMarkUp(op.CostingPrice);
						op.AdminMarkUpPercentage = oAdmniMarkUp.adminMarkUpPercentage;
			  			op.AdminMarkUpAmount = oAdmniMarkUp.adminMarkUpAmount;
						
						
						obj.Custom_Objects = op;
						obj.FlightApiData= oFList[0];
						
					}
					//obj.Custom_Price = op;
					oNewAarray.push(obj);
					
						
					
			});
			
			return oNewAarray;
			
		},
		
		onProcess:function(oEvent){
			
			//let {country_id} = this.onGetUser();
			//console.log(country_id);
			var oUser = this.onGetUser();
			console.log(oUser);
			var oUnique = this.onFindUniqueAirlineAndFights();
			console.log(oUnique);
			
			var oUnAllowedAirlines = this.onFindUnAllowedAirlines(oUnique.UniqueAirlines,oUser);
			console.log(oUnAllowedAirlines);
			
			// now remove unalllowed airline code from oUniqueAirline and oUniqueFlight list.
			if(oUnAllowedAirlines.length > 0)
			{
					
					var oDIndex, oAFlights = [];
					oUnAllowedAirlines.forEach(function(el,idx){
						oDIndex  = oUnique.UniqueAirlines.map(function (obj) { return obj; }).indexOf(el);
						if(oDIndex !== -1){
							oUnique.UniqueAirlines.splice(oDIndex,1);
						}
						
						//new get all array object from Unique Flights.
						oUnique.UniqueFlights = oUnique.UniqueFlights.filter(function (x) { return x.AirlineCode !== el; })
						oUnique.UniqueFlightsAirlineOnly =oUnique.UniqueFlightsAirlineOnly.filter(function (x) { return x.AirlineCode !== el; })

					});
			}
			
			console.log(oUnique.UniqueFlights);
			console.log(oUnique.UniqueAirlines);
			console.log(oUnique.UniqueFlightsAirlineOnly);
			
			var oFlightsArr = this.onAddPriceIndexedForBaseAiTTaxAndSegemnt(oUnique.UniqueFlights,oUser.country_id);
			console.log(oFlightsArr);
			
			// now group by airline Code.
			var oGPFlightsArr =[];
			oUnique.UniqueFlightsAirlineOnly.forEach(function(el,index)
			{
					var oFList = oFlightsArr.filter(function(obj){
					   return obj.AirlineCode === el.AirlineCode && obj.FlightNo === el.FlightNo;
					});
					
					if(oFList.length > 0){
						
						/*oFList.sort((a, b) => {
				    			return parseFloat(a.Custom_Objects.CostingPrice) - parseFloat(b.Custom_Objects.CostingPrice);
							});*/
						oFList.sort(function(a,b){
							return parseFloat(a.Custom_Objects.CostingPrice) - parseFloat(b.Custom_Objects.CostingPrice);
						})
							
						oGPFlightsArr.push(...oFList);
					}
						
						
			});
			
			console.log(oGPFlightsArr);
			this.getView().getModel("oView").setProperty("/FlightCostingList",oGPFlightsArr);
			this.onLoadDatatoTableForCalculateCosting();
			
			var oFlightArray_Lowest_Price =[]; var that = this;
				oUnique.UniqueFlightsAirlineOnly.forEach(function(olm){
					
					that.onGetLowestPriceBaseonAirlineCode(olm.AirlineCode,olm.FlightNo,function(obj)
						{
							
							if(Object.keys(obj).length > 0)
							{
								obj.Custom_Objects.AgentName= oUser.agent_name;
								obj.Custom_Objects.AgentPercentage= parseFloat(oUser.mark_up).toFixed(2).toString();
								obj.Custom_Objects.AgentAmount = that.onGetAgentPice(obj.Custom_Objects.AdminMarkUpAmount,oUser.mark_up);
								
								oFlightArray_Lowest_Price.push(obj);
							}
							//oFlightArray_Lowest_Price.push(object);
						});
					
				});
				
			console.log(oFlightArray_Lowest_Price);
			this.getView().getModel("oView").setProperty("/FormattedFlightList",oFlightArray_Lowest_Price);
			this.onLoadTableForFlights();
			
			
		},
		
		onGetAgentPice:function(AdminMarkUpPrice,AgentMarkUp){
			
			return  ( parseFloat(AdminMarkUpPrice) + ( (parseFloat(AdminMarkUpPrice) * parseFloat(AgentMarkUp))/100 )).toFixed(2).toString();
		},
		
		onLoadDatatoTableForCalculateCosting:function(){
			//tablCalcosting
				var oTable = this.getView().byId("tablCalcosting"),
				oModel = new sap.ui.model.json.JSONModel(this.getView().getModel("oView").getProperty("/FlightCostingList"));
    			oTable.setModel(oModel);
    			
    			oTable.bindAggregation("items","oView>/FlightCostingList",function(sId,oContext){

    				var oComponent ;
    				return new sap.m.ColumnListItem({
										cells : 
										[
											new sap.m.ObjectStatus({
												text:" {oView>FlightNo}"
												
											}),
											new sap.m.ObjectStatus({
												text:" {oView>Pcc_Owner_Name}"
												
											}),
											new sap.m.ObjectStatus({
												text:" {oView>Custom_Objects/BasePrice}"
												
											}),
											
											new sap.m.HBox({
												items:[
															
															new sap.m.ObjectStatus({
																text:" {oView>Custom_Objects/AitTax_percentage}%"
																
															}).addStyleClass("sapUiTinyMarginEnd"),
															
															new sap.m.ObjectStatus({
																text:" = {oView>Custom_Objects/AitTax}"
																
															})
													]
											}),
											
											new sap.m.HBox({
												items:[
															
															new sap.m.ObjectStatus({
																text:" {oView>Custom_Objects/SpRouteDiscountPercentage}%"
																
															}).addStyleClass("sapUiTinyMarginEnd"),
															new sap.m.ObjectStatus({
																text:" = {oView>Custom_Objects/SpRouteDiscountAmount}"
															})
													]
											}),
											
											new sap.m.HBox({
												items:[
															
															new sap.m.ObjectStatus({
																text:" {oView>Custom_Objects/CommissionPercentage}%"
															}).addStyleClass("sapUiTinyMarginEnd"),
															new sap.m.ObjectStatus({
																text:" = {oView>Custom_Objects/CommissionAmount}"
															})
													]
											}),
											new sap.m.HBox({
												items:[
															
															new sap.m.ObjectStatus({
																text:" {oView>Custom_Objects/DisscountPercentage}%"
															}).addStyleClass("sapUiTinyMarginEnd"),
															new sap.m.ObjectStatus({
																text:" = {oView>Custom_Objects/DisscountAmout}"
															})
													]
											}),
											new sap.m.HBox({
												items:[
															new sap.m.ObjectStatus({
																text:"{oView>Custom_Objects/NoOfSegments} * {oView>Custom_Objects/PerSegmentAmout}"
																
															}).addStyleClass("sapUiTinyMarginEnd"),
															
															new sap.m.ObjectStatus({
																text:" = {oView>Custom_Objects/TotalSegmentAmount}"
																
															})
													]
											}),
										
											
											
											new sap.m.ObjectStatus({
												text:" {oView>Custom_Objects/CostingPrice}"
											
											}),
											new sap.m.ObjectStatus({
												text:" {oView>Custom_Objects/AdminMarkUpAmount}"
												
											})
													
															


										]  // end of cells..
							    	});	
    				
    				
    			});
		},
		
		onLoadTableForFlights:function(){
			var oTable = this.getView().byId("ApiTable1"),
				oModel = new sap.ui.model.json.JSONModel(this.getView().getModel("oView").getProperty("/FormattedFlightList"));
    			oTable.setModel(oModel);
    			
    			oTable.bindAggregation("items","oView>/FormattedFlightList",function(sId,oContext){

    				var oComponent ;
    				return new sap.m.ColumnListItem({
										cells : 
										[
											new sap.m.VBox({
												items:[
													
															
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																							title:"Airline"
																							
																		
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:"{oView>AilineCode}"
																								
																				})
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																							title:"Flight No"
																							
																		
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:"{oView>FlightNo}"
																							
																				})
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																							title:"Origin"
																							
																		
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:"{oView>FlightApiData/origin}"
																								
																				})
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																							title:"Destination"
																							
																		
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:"{oView>FlightApiData/destination}"
																								
																				})
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																							title:"No. Segment"
																							
																		
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:"{oView>Custom_Objects/NoOfSegments}"
																								
																				})
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom")
													
													
													]	
											}),
											
											
											
											
											new sap.m.VBox({
												items:[
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																								title:"Base Price"
																								
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:" {oView>Custom_Objects/BasePrice}"
																								
																				})
																				
																				
																				
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																								title:"AIT Tax"
																								
																				}),
																				
																				new sap.m.HBox({
																					items:[
																							new sap.m.Text({
																								text:"{oView>Custom_Objects/AitTax_percentage}%"
																							}),
																							new sap.m.ObjectStatus({
																								
																								text:" + {oView>Custom_Objects/AitTax}"
																								
																							}).addStyleClass("sapUiTinyMarginBegin")
																						]
																				})
																				
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																								title:"Special Disccount"
																								
																				}),
																				new sap.m.HBox({
																					items:[
																							new sap.m.Text({
																								text:"{oView>Custom_Objects/DisscountPercentage}%"
																							}),
																							
																							new sap.m.ObjectStatus({
																								
																								text:" - {oView>Custom_Objects/DisscountAmout}"
																								
																							}).addStyleClass("sapUiTinyMarginBegin")
																						]
																				})
																				
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																								title:"Segment Cost"
																								
																				}),
																				
																				new sap.m.HBox({
																					items:[
																							new sap.m.Text({
																								text:"{oView>Custom_Objects/PerSegmentAmout}*{oView>Custom_Objects/NoOfSegments}"
																							}),
																							
																							new sap.m.ObjectStatus({
																								
																								text:" - {oView>Custom_Objects/TotalSegmentAmount}"
																							
																							}).addStyleClass("sapUiTinyMarginBegin")
																						]
																				})
																				
																				
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom"),
															
															new sap.m.FlexBox({
																				direction:"Row",alignItems:"Start", justifyContent:"SpaceBetween",
								    					 			items:[
								    					 						new sap.m.ObjectStatus({
																								title:"Costing Price"
																				}),
																				new sap.m.ObjectStatus({
																								
																								text:" {oView>Custom_Objects/CostingPrice}"
																				})
																				
																				
																				
																			]
															}).addStyleClass("sapUiTinyMarginTopBottom")
													
													]
											}).addStyleClass("sapUiTinyMarginBeginEnd"),
										
											
										
											new sap.m.Text({
												text:"{oView>Custom_Objects/AdminMarkUpAmount}"
											}),
											
											new sap.m.Text({
												text:"{oView>Custom_Objects/AgentName}"
											}), 
												new sap.m.Text({
												text:"{oView>Custom_Objects/AgentAmount}"
											}),
															
											

										]  // end of cells..
							    	});	
    				
    				
    			});
		}
		

	});
});