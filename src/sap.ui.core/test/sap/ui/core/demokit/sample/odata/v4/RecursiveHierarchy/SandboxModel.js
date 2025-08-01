/*!
 * ${copyright}
 */
// The SandboxModel is used in the manifest instead of OData V4 model for the following purposes:
// Certain constructor parameters are taken from URL parameters. For the "non-realOData" case, a
// mock server for the back-end requests is set up.
sap.ui.define([
	"sap/ui/core/sample/common/SandboxModelHelper",
	"sap/ui/model/odata/v4/ODataModel"
], function (SandboxModelHelper, ODataModel) {
	"use strict";
	function SandboxModel(mParameters) {
		return SandboxModelHelper.adaptModelParametersAndCreateModel(mParameters, {
			sFilterBase : "/sap/opu/odata4/IWBEP/TEA/default/IWBEP/TEA_BUSI/0001/",
			mFixture : {},
			aRegExps : [{
				regExp : /^DELETE \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES\('([^']*)'\)$/,
				response : {buildResponse : buildDeleteResponse, code : 204}
			}, {
				regExp : /^GET [\w\/.]+\$metadata([\w?&\-=]+sap-language=..|)$/,
				response : {source : "metadata.xml"}
			}, {
				regExp : /^GET \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES\?(.*)$/,
				response : {buildResponse : buildGetCollectionResponse}
			}, {
				regExp : /^GET \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES\('([^']*)'\)\?(.*)$/,
				response : {buildResponse : buildGetSingleResponse}
			}, {
				regExp : /^PATCH \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES\('([^']*)'\)$/,
				response : {buildResponse : buildPatchResponse, code : 204}
			}, {
				regExp : /^PATCH \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/(\$0\.0)$/,
				response : {buildResponse : buildPatchResponse, code : 204}
			}, {
				regExp : /^POST \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES$/,
				response : {buildResponse : buildPostResponse}
			}, {
				regExp : /^POST \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES\('([^']*)'\)\/com\.sap\.gateway\.default\.iwbep\.tea_busi\.v0001\.__FAKE__AcChangeNextSibling$/,
				response : {buildResponse : buildChangeNextSiblingResponse}
			}, {
				regExp : /^POST \/sap\/opu\/odata4\/IWBEP\/TEA\/default\/IWBEP\/TEA_BUSI\/0001\/EMPLOYEES\('([^']*)'\)\/com\.sap\.gateway\.default\.iwbep\.tea_busi\.v0001\.__FAKE___AcCopy\?\$select=ID$$/,
				response : {buildResponse : buildCopyResponse}
			}],
			sSourceBase : "sap/ui/core/sample/odata/v4/RecursiveHierarchy/data"
		});
	}

	// IDEAS:
	// - AGE determines sibling order (ascending), parents are older than their children
	// - ID is hierarchical (but we omit the "0." prefix)
	// - Name follows Greek alphabet in preorder
	// Αα  Alpha
		// Ββ  Beta
			// Γγ  Gamma
				// Δδ  Delta
				// Εε  Epsilon
			// Ζζ  Zeta
				// Ηη  Eta
				// Θθ  Theta
				// Ιι  Iota
		// Κκ  Kappa
		// Λλ  Lambda
		// Μμ  Mu
			// Νν  Nu
		// Ξξ  Xi
			// Οο  Omicron
				// Ππ  Pi
				// Ρρ  Rho
				// Σσς Sigma
				// Ττ  Tau
				// Υυ  Upsilon
				// Φφ  Phi
				// Χχ  Chi
				// Ψψ  Psi
				// Ωω  Omega
	const aOriginalData = [{
		AGE : 60,
		ID : "0",
		Name : "Alpha"
	}, {
		AGE : 55,
		ID : "1",
		Name : "Beta"
	}, {
		AGE : 41,
		ID : "1.1",
		Name : "Gamma"
	}, {
		AGE : 38,
		ID : "1.1.1",
		Name : "Delta"
	}, {
		AGE : 39,
		ID : "1.1.2",
		Name : "Epsilon"
	}, {
		AGE : 42,
		ID : "1.2",
		Name : "Zeta"
	}, {
		AGE : 31,
		ID : "1.2.1",
		Name : "Eta"
	}, {
		AGE : 32,
		ID : "1.2.2",
		Name : "Theta"
	}, {
		AGE : 33,
		ID : "1.2.3",
		Name : "Iota"
	}, {
		AGE : 56,
		ID : "2",
		Name : "Kappa"
	}, {
		AGE : 57,
		ID : "3",
		Name : "Lambda"
	}, {
		AGE : 58,
		ID : "4",
		Name : "Mu"
	}, {
		AGE : 41,
		ID : "4.1",
		Name : "Nu"
	}, {
		AGE : 59,
		ID : "5",
		Name : "Xi"
	}, {
		AGE : 41,
		ID : "5.1",
		Name : "Omicron"
	}, {
		AGE : 21,
		ID : "5.1.1",
		Name : "Pi"
	}, {
		AGE : 22,
		ID : "5.1.2",
		Name : "Rho"
	}, {
		AGE : 23,
		ID : "5.1.3",
		Name : "Sigma"
	}, {
		AGE : 24,
		ID : "5.1.4",
		Name : "Tau"
	}, {
		AGE : 25,
		ID : "5.1.5",
		Name : "Upsilon"
	}, {
		AGE : 26,
		ID : "5.1.6",
		Name : "Phi"
	}, {
		AGE : 27,
		ID : "5.1.7",
		Name : "Chi"
	}, {
		AGE : 28,
		ID : "5.1.8",
		Name : "Psi"
	}, {
		AGE : 29,
		ID : "5.1.9",
		Name : "Omega"
	}];

	let aAllNodes; // in preorder, does not contain nodes that are filtered out
	let sCopyID; // the ID of the copy, needed for patching the parent with Content-ID referencing
	let mChildrenByParentId; // no entry for leaves! Does not contain nodes that are filtered out
	const aNewRootIDs // the IDs for a newly created root node or a copied node
		= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
	let mNodeById; // contains all nodes incl. those filtered out
	let iRevision;
	let mRevisionOfAgeById;

	/**
	 * Adjust the DescendantCount of the node with given ID (and all of its ancestors) by the
	 * given difference.
	 *
	 * @param {string} sId - A node ID
	 * @param {number} iDiff - Some difference
	 */
	function adjustDescendantCount(sId, iDiff) {
		mNodeById[sId].DescendantCount += iDiff;
		sId = mNodeById[sId].MANAGER_ID;
		if (sId) {
			adjustDescendantCount(sId, iDiff);
		}
	}

	/**
	 * Adjust the DistanceFromRoot of the given node (and all of its descendants) by the given
	 * difference.
	 *
	 * @param {object} oNode - A node
	 * @param {number} iDiff - Some difference
	 */
	function adjustDistanceFromRoot(oNode, iDiff) {
		oNode.DistanceFromRoot += iDiff;
		mChildrenByParentId[oNode.ID]?.forEach(
			(oChild) => { adjustDistanceFromRoot(oChild, iDiff); });
	}

	/**
	 * Builds a response for any POST request on the "ChangeNextSibling" action.
	 *
	 * @param {string[]} aMatches - The matches against the RegExp
	 * @param {object} _oResponse - Response object to fill
	 * @param {object} oRequest - Request object to get POST body from
	 */
	function buildChangeNextSiblingResponse(aMatches, _oResponse, oRequest) {
		const oNode = mNodeById[aMatches[1]];
		const sParentId = oNode.MANAGER_ID;

		// {"NextSibling" : {"ID" : "1"}}
		const oBody = JSON.parse(oRequest.requestBody);
		if (oBody.NextSibling === null) { // node becomes *last*
			if (sParentId) { // make last child
				const aChildren = mChildrenByParentId[sParentId];
				if (aChildren.length > 1) {
					aChildren.splice(aChildren.indexOf(oNode), 1);
					aChildren.push(oNode);
					const aSpliced
						= aAllNodes.splice(aAllNodes.indexOf(oNode), oNode.DescendantCount + 1);
					aAllNodes.splice(aAllNodes.indexOf(aChildren.at(-2)) + 1, 0, ...aSpliced);
				} // else: no change
			} else { // make last root
				const aSpliced
					= aAllNodes.splice(aAllNodes.indexOf(oNode), oNode.DescendantCount + 1);
				aAllNodes.push(...aSpliced);
			}
		} else { // next sibling is specified
			const oNextSibling = mNodeById[oBody.NextSibling.ID];
			if (oNextSibling.MANAGER_ID !== sParentId) {
				throw new Error("Parent mismatch");
			}
			if (sParentId) { // move child inside mChildrenByParentId[...]
				const aChildren = mChildrenByParentId[sParentId];
				aChildren.splice(aChildren.indexOf(oNode), 1);
				aChildren.splice(aChildren.indexOf(oNextSibling), 0, oNode);
			}
			// move root (or child inside aAllNodes)
			const aSpliced = aAllNodes.splice(aAllNodes.indexOf(oNode), oNode.DescendantCount + 1);
			aAllNodes.splice(aAllNodes.indexOf(oNextSibling), 0, ...aSpliced);
		}
		// no response required
	}

	/**
	 * Builds a response for any POST request on the "Copy" action.
	 *
	 * @param {string[]} aMatches - The matches against the RegExp
	 * @param {object} oResponse - Response object to fill
	 */
	function buildCopyResponse(aMatches, oResponse) {
		const oCopy = copy(mNodeById[aMatches[1]], aNewRootIDs.shift(), /*sNewManagerID*/null);
		adjustDistanceFromRoot(oCopy, -oCopy.DistanceFromRoot);
		sCopyID = oCopy.ID;

		// RAP would not respond w/ DescendantCount,DistanceFromRoot,DrillState!
		const oResultNode = {...oCopy};
		delete oResultNode.DescendantCount;
		delete oResultNode.DistanceFromRoot;
		delete oResultNode.DrillState;
		oResponse.message = JSON.stringify(oResultNode);
	}

	/**
	 * Builds a response for any DELETE request on a specific "EMPLOYEE" instance.
	 *
	 * @param {string[]} aMatches - The matches against the RegExp
	 * @param {object} _oResponse - Response object to fill
	 */
	function buildDeleteResponse(aMatches, _oResponse) {
		/**
		 * Recursively visits all of the given node's descendants, deleting them in post order.
		 *
		 * @param {object} oNode - A node
		 */
		function visit(oNode) {
			const sId = oNode.ID;
			mChildrenByParentId[sId]?.forEach(visit);
			delete mChildrenByParentId[sId];
			delete mNodeById[sId];
			delete mRevisionOfAgeById[sId];
			aAllNodes.splice(aAllNodes.indexOf(oNode), 1);
		}

		const oNode = mNodeById[aMatches[1]];
		visit(oNode);
		if (oNode.MANAGER_ID) {
			const aChildren = mChildrenByParentId[oNode.MANAGER_ID];
			aChildren.splice(aChildren.indexOf(oNode), 1);
			if (!aChildren.length) {
				delete mChildrenByParentId[oNode.MANAGER_ID];
			}
			adjustDescendantCount(oNode.MANAGER_ID, -(oNode.DescendantCount + 1));
		}
		// no response required
	}

	/**
	 * Builds a response for any GET query on the "EMPLOYEES" collection.
	 *
	 * @param {string[]} aMatches - The matches against the RegExp
	 * @param {object} oResponse - Response object to fill
	 */
	function buildGetCollectionResponse(aMatches, oResponse) {
		const mQueryOptions = getQueryOptions(aMatches[1]);
		function getExpandLevels() {
			if (mQueryOptions.$apply.includes("ExpandLevels")) {
				let sExpandLevels = mQueryOptions.$apply.match(/,ExpandLevels=(.+)\)/)[1];
				sExpandLevels = decodeURIComponent(sExpandLevels);
				return new Map(JSON.parse(sExpandLevels).map(
					(o) => [o.NodeID, o.Levels ?? Number.MAX_SAFE_INTEGER]));
			}
		}

		if ("$apply" in mQueryOptions) {
			if (mQueryOptions.$apply.includes("TopLevels")) {
				// "EMPLOYEES?$apply=orderby(AGE)"
				// + "/com.sap.vocabularies.Hierarchy.v1.TopLevels(HierarchyNodes=$root/EMPLOYEES"
				// + ",HierarchyQualifier='OrgChart',NodeProperty='ID',Levels=" + iLevels + ")"
				// Note: "Levels" is optional!
				const iLevels = mQueryOptions.$apply.includes(",Levels=")
					? parseInt(mQueryOptions.$apply.match(/,Levels=(\d+)/)[1])
					: Infinity;
				let aRows = topLevels(iLevels - 1, getExpandLevels()); // Note: already cloned
				if ("$filter" in mQueryOptions) {
					if (mQueryOptions.$filter.includes("LimitedRank")) {
						// e.g. LimitedRank lt 5 and DistanceFromRoot lt 2
						// e.g. LimitedRank gt 4 and DistanceFromRoot lt 2
						const aFilterMatches = mQueryOptions.$filter.match(
							/LimitedRank%20(gt|lt)%20(\d+)%20and%20DistanceFromRoot%20lt%20(\d+)/);
						const bGreater = aFilterMatches[1] === "gt";
						const iLimitedRank = parseInt(aFilterMatches[2]);
						const iDistanceFromRoot = parseInt(aFilterMatches[3]);
						aRows = aRows.filter((oNode, i) => {
							oNode.LimitedRank = String(i); // Edm.Int64
							return (bGreater ? i > iLimitedRank : i < iLimitedRank)
								&& oNode.DistanceFromRoot < iDistanceFromRoot;
						});
						if (mQueryOptions.$orderby === "LimitedRank%20desc") {
							aRows = aRows.reverse();
						}
					} else { // ID%20eq%20'1'
						const aIDs = mQueryOptions.$filter.split("%20or%20").map(
							(sID_Predicate) => sID_Predicate.split("%20eq%20")[1].slice(1, -1));
						aRows = aRows.filter((oNode, i) => {
							oNode.LimitedRank = String(i); // Edm.Int64
							return aIDs.includes(oNode.ID);
						});
					}
				}
				selectCountSkipTop(aRows, mQueryOptions, oResponse);
				return;
			}

			if (mQueryOptions.$apply.includes("descendants")) {
				// "EMPLOYEES?$apply=ancestors($root/EMPLOYEES,OrgChart,ID
				// + ",filter(STATUS%20ne%20'Out'),keep%20start)"
				// + "/descendants($root/EMPLOYEES,OrgChart,ID,filter(ID%20eq%20'" + sParentId
				// + "'),1)/orderby(AGE)"
				let aDescendants = [];
				const addDescendants = (sParentId, bAll) => {
					mChildrenByParentId[sParentId]?.forEach((oChild) => {
						aDescendants.push(oChild);
						if (bAll) {
							addDescendants(oChild.ID, true);
						}
					});
				};
				const [, sParentId, bSingle]
					= mQueryOptions.$apply.match(/,filter\(ID%20eq%20'([^']*)'\)(,1)?/);
				addDescendants(sParentId, !bSingle);
				if ("$filter" in mQueryOptions) {
					const bNot = mQueryOptions.$filter.startsWith("not%20(");
					if (bNot) {
						// not%20(ID%20eq%20'5.1.10'%20or%20ID%20eq%20'5.1.11')
						mQueryOptions.$filter
							= mQueryOptions.$filter.slice("not%20(".length, -")".length);
					}
					const aIDs = mQueryOptions.$filter
						.split("%20or%20")
						.map((sID_Predicate) => sID_Predicate.split("%20eq%20")[1].slice(1, -1));
					aDescendants
						= aDescendants.filter((oChild) => aIDs.includes(oChild.ID) !== bNot);
				}
				selectCountSkipTop(aDescendants, mQueryOptions, oResponse);
				return;
			}

			// "$orderby=AGE&$select=ID,MANAGER_ID,Name,AGE"
			// + "&$apply=ancestors($root/EMPLOYEES,OrgChart,ID,filter(ID%20eq%20'3'),1)"
			const sChildId = mQueryOptions.$apply.match(/,filter\(ID%20eq%20'([^']*)'\)/)[1];
			const sParentId = mNodeById[sChildId].MANAGER_ID;
			selectCountSkipTop([mNodeById[sParentId]], mQueryOptions, oResponse);
			return;
		}

		if ("$filter" in mQueryOptions) {
			const sFilter = mQueryOptions.$filter;
			let aRows;
			if (sFilter.startsWith("contains(")) {
				// contains(ID,'5')%20or%20contains(Name,'5')
				const sValue = sFilter.split("%20or%20")[0].slice(sFilter.indexOf("'") + 1, -2);
				aRows = Object.values(mNodeById).filter((oNode) => {
					return oNode.ID.includes(sValue) || oNode.Name.includes(sValue);
				});
			} else {
				// ID%20eq%20'0'%20or%20ID%20eq%20'1'%20or%20ID%20eq%20'1.1'
				const aIDs = sFilter.split("%20or%20")
					.map((sID_Predicate) => sID_Predicate.split("%20eq%20")[1].slice(1, -1));
				if (aIDs.length > 1 || aIDs[0] === "0") {
					// side effect for all rows or just the root
					iRevision += 1;
				}
				aRows = aIDs.map((sId) => mNodeById[sId]);
			}
			selectCountSkipTop(aRows, mQueryOptions, oResponse);
			return;
		}

		selectCountSkipTop(aAllNodes, mQueryOptions, oResponse);
	}

	/**
	 * Builds a response for any GET request on a specific "EMPLOYEE" instance.
	 *
	 * @param {string[]} aMatches - The matches against the RegExp
	 * @param {object} oResponse - Response object to fill
	 */
	function buildGetSingleResponse(aMatches, oResponse) {
		// EMPLOYEES('B')?$select=AGE,DescendantCount,DistanceFromRoot,DrillState,ID,MANAGER_ID,Name
		const aSelect = getQueryOptions(aMatches[2]).$select.split(",");
		const select = (oNode) => { //TODO share w/ selectCountSkipTop?
			const oResult = {};
			for (const sSelect of aSelect) {
				oResult[sSelect] = oNode[sSelect];
			}
			return oResult;
		};
		const oNode = select(mNodeById[aMatches[1]]);
		// RAP would not respond w/ DescendantCount,DistanceFromRoot,DrillState!
		delete oNode.DescendantCount;
		delete oNode.DistanceFromRoot;
		delete oNode.DrillState;
		// Note: bSkipCopy due to select
		oResponse.message = JSON.stringify(update([oNode], true)[0]);
	}

	/**
	 * Builds a response for any PATCH request on a specific "EMPLOYEE" instance.
	 *
	 * @param {string[]} aMatches - The matches against the RegExp
	 * @param {object} _oResponse - Response object to fill
	 * @param {object} oRequest - Request object to get PATCH body from
	 */
	function buildPatchResponse(aMatches, _oResponse, oRequest) {
		function findLastIndex(aArray, fnPredicate) {
			return aArray.reduce((iLast, oItem, i) => (fnPredicate(oItem) ? i : iLast), -1);
		}

		if (oRequest.requestHeaders.Prefer !== "return=minimal") {
			throw new Error("Unsupported Prefer header: " + oRequest.requestHeaders.Prefer);
		}
		// {"Name" : "<new name>"}
		// "EMPLOYEE_2_MANAGER@odata.bind" : "EMPLOYEES('1')"
		const oBody = JSON.parse(oRequest.requestBody);
		switch (Object.keys(oBody).length === 1 && Object.keys(oBody)[0]) {
			case "EMPLOYEE_2_MANAGER@odata.bind": {
				const oChild = aMatches[1] === "$0.0"
					? mNodeById[sCopyID]
					: mNodeById[aMatches[1]];
				if (oChild.Name.includes("ERROR")) {
					throw new Error("This request intentionally failed!");
				}

				const sParentId = oBody["EMPLOYEE_2_MANAGER@odata.bind"]
					?.slice("EMPLOYEES('".length, -"')".length) ?? null;
				if (sParentId) {
					for (let sId = sParentId; sId; sId = mNodeById[sId].MANAGER_ID) {
						if (sId === oChild.ID) { // cycle detected
							throw new Error("Parent must not be a descendant of moved node");
						}
					}
				}

				if (oChild.MANAGER_ID) {
					const aChildren = mChildrenByParentId[oChild.MANAGER_ID];
					aChildren.splice(aChildren.indexOf(oChild), 1);
					if (!aChildren.length) { // last child has gone
						delete mChildrenByParentId[oChild.MANAGER_ID];
						mNodeById[oChild.MANAGER_ID].DrillState = "leaf";
					}
					adjustDescendantCount(oChild.MANAGER_ID, -(oChild.DescendantCount + 1));
				}

				const aSpliced
					= aAllNodes.splice(aAllNodes.indexOf(oChild), oChild.DescendantCount + 1);
				let iNewIndex; // Note: "AGE determines sibling order (ascending)"
				if (sParentId) {
					if (!(sParentId in mChildrenByParentId)) {
						// new parent not a leaf anymore
						mNodeById[sParentId].DrillState = "collapsed"; // @see #reset
						mChildrenByParentId[sParentId] = [];
					}
					adjustDescendantCount(sParentId, oChild.DescendantCount + 1);
					const iLastYounger = findLastIndex(mChildrenByParentId[sParentId],
						(oSibling) => oSibling.AGE < oChild.AGE); // Note: might be -1
					mChildrenByParentId[sParentId].splice(iLastYounger + 1, 0, oChild);
					if (iLastYounger < 0) { // right after parent
						iNewIndex = aAllNodes.indexOf(mNodeById[sParentId]) + 1;
					} else { // just after last younger sibling's descendants!
						const oLastYounger = mChildrenByParentId[sParentId][iLastYounger];
						iNewIndex
							= aAllNodes.indexOf(oLastYounger) + oLastYounger.DescendantCount + 1;
					}
				} else { // find last younger root
					const iLastYounger = findLastIndex(aAllNodes,
						(oNode) => !oNode.MANAGER_ID && oNode.AGE < oChild.AGE); // might be -1
					iNewIndex = iLastYounger < 0
						? 0
						: iLastYounger + aAllNodes[iLastYounger].DescendantCount + 1;
				}
				aAllNodes.splice(iNewIndex, 0, ...aSpliced);

				oChild.MANAGER_ID = sParentId;
				const iParentDistanceFromRoot = sParentId
					? mNodeById[sParentId].DistanceFromRoot
					: -1;
				adjustDistanceFromRoot(oChild,
					iParentDistanceFromRoot + 1 - oChild.DistanceFromRoot);
				break;
			}

			case "Name":
				// ignore suffixes added by SandboxModel.update
				mNodeById[aMatches[1]].Name = oBody.Name.split(" #")[0];
				// side effect for single row
				mRevisionOfAgeById[aMatches[1]] += 1;
				break;

			default:
				throw new Error("Unsupported PATCH body: " + oRequest.requestBody);
		}
		// no response required
	}

	/**
	 * Builds a response for any POST request on the "EMPLOYEES" collection.
	 *
	 * @param {string[]} _aMatches - The matches against the RegExp
	 * @param {object} oResponse - Response object to fill
	 * @param {object} oRequest - Request object to get POST body from
	 */
	function buildPostResponse(_aMatches, oResponse, oRequest) {
		function parseLastSegment(sId) {
			if (sId.includes(".")) {
				sId = sId.slice(sId.lastIndexOf(".") + 1);
			}

			return parseInt(sId);
		}

		// compares two hierarchical IDs according to the last(!) segment (numerically, ascending)
		function compareByID(oNodeA, oNodeB) {
			return parseLastSegment(oNodeA.ID) - parseLastSegment(oNodeB.ID);
		}

		function isChildID(sChildID, sParentId) {
			return sChildID !== sParentId
				&& (sParentId === "0"
					? /^\d+$/.test(sChildID) // Note: letters denote other roots!
					: sChildID.startsWith(sParentId)
						&& !sChildID.slice(sParentId.length + 1).includes("."));
		}

		// {"EMPLOYEE_2_MANAGER@odata.bind" : "EMPLOYEES('0')"}
		const oBody = JSON.parse(oRequest.requestBody);
		const bFilteredOut = oBody.STATUS === "Out";
		const sParentId = oBody["EMPLOYEE_2_MANAGER@odata.bind"]
			?.slice("EMPLOYEES('".length, -"')".length);
		const oParent = mNodeById[sParentId];
		if (sParentId && !oParent) {
			throw new Error("Invalid parent ID: " + sParentId);
		}

		const oNewChild = { // same order of keys than for "old" nodes ;-)
			AGE : 0, // see below
			ID : "", // see below
			Name : "", // Q: Derive default from parent's Name? A: No, it's editable!
			DistanceFromRoot : oParent ? oParent.DistanceFromRoot + 1 : 0,
			DrillState : "leaf",
			MANAGER_ID : sParentId ?? null,
			DescendantCount : 0,
			STATUS : bFilteredOut ? "Out" : ""
		};

		if (sParentId) {
			if (sParentId in mChildrenByParentId) {
				// Note: "AGE determines sibling order (ascending)"
				oNewChild.AGE = mChildrenByParentId[sParentId][0].AGE - 1;
			} else { // parent not a leaf anymore
				oParent.DrillState = "collapsed"; // @see #reset
				oNewChild.AGE = oParent.AGE - 1;
			}

			// use "largest" child ID which is hierarchical to parent
			const sLastChildID = Object.values(mNodeById)
				.filter((oChild) => isChildID(oChild.ID, sParentId))
				.sort(compareByID)
				.at(-1)?.ID;
			if (sLastChildID === undefined) {
				oNewChild.ID = sParentId + ".1";
			} else if (sParentId === "0") {
				oNewChild.ID = String(parseLastSegment(sLastChildID) + 1);
			} else {
				oNewChild.ID = sParentId + "." + (parseLastSegment(sLastChildID) + 1);
			}
		} else { // new root
			const iRootCount = Object.values(mNodeById)
				.filter((oNode) => oNode.MANAGER_ID === null)
				.length;
			oNewChild.AGE = 60 + iRootCount;
			oNewChild.ID = aNewRootIDs.shift();
		}

		if (oNewChild.ID in mNodeById) {
			throw new Error("Illegal state: duplicate node ID " + oNewChild.ID);
		}
		mNodeById[oNewChild.ID] = oNewChild;
		mRevisionOfAgeById[oNewChild.ID] = 0;
		if (!bFilteredOut) {
			if (sParentId) {
				// Note: server's insert position must not affect UI (until refresh!)
				mChildrenByParentId[sParentId] ??= [];
				mChildrenByParentId[sParentId].push(oNewChild);
				adjustDescendantCount(sParentId, +1);
				aAllNodes.splice(aAllNodes.indexOf(oParent) + oParent.DescendantCount, 0,
					oNewChild);
			} else {
				aAllNodes.push(oNewChild);
			}
		}

		const oCopy = {...update([oNewChild])[0]};
		// RAP would not respond w/ DescendantCount,DistanceFromRoot,DrillState!
		delete oCopy.DescendantCount;
		delete oCopy.DistanceFromRoot;
		delete oCopy.DrillState;
		oResponse.message = JSON.stringify(oCopy);
	}

	/**
	 * Copies the given node and all its descendants recursively and sets the ID and the MANAGER_ID.
	 *
	 * @param {object} oNode - A node
	 * @param {string} sNewID - The new ID for the given node
	 * @param {string|null} sNewManagerID - The new MANAGER_ID for the given node
	 * @returns {object} - The copy of the given node
	 */
	function copy(oNode, sNewID, sNewManagerID) {
		const sOldID = oNode.ID;
		oNode = {...oNode};
		oNode.ID = sNewID;
		oNode.MANAGER_ID = sNewManagerID;
		oNode.Name = "Copy of " + (oNode.Name || sNewID);

		aAllNodes.push(oNode); // Note: preorder (parent before child)
		mNodeById[sNewID] = oNode;
		mRevisionOfAgeById[sNewID] = 0;

		mChildrenByParentId[sOldID]?.forEach((oChild, i) => {
			(mChildrenByParentId[sNewID] ??= []).push(
				copy(oChild, sNewID + "." + (i + 1), sNewID));
		});

		return oNode;
	}

	/**
	 * Gets the query options as a map from the given URL query part.
	 *
	 * @param {string} sQuery - Query part of a URL
	 * @returns {Object<string,string>} Map of query options
	 */
	function getQueryOptions(sQuery) {
		const mQueryOptions = {};
		for (const sName_Value of sQuery.split("&")) {
			const [sName, ...aValues] = sName_Value.split("=");
			mQueryOptions[sName] = aValues.join("=");
		}

		return mQueryOptions;
	}

	function reset() {
		aAllNodes = aOriginalData.map((oNode) => ({...oNode}));
		mChildrenByParentId = {};
		mNodeById = {};
		iRevision = 0;
		mRevisionOfAgeById = {};

		aAllNodes.forEach((oNode) => {
			oNode.STATUS = "";
			// oNode.DescendantCount = 0; // @see computeDescendantCount
			oNode.DistanceFromRoot = oNode.ID === "0"
				? 0
				: oNode.ID.split(".").length; // Note: ID is hierarchical
			oNode.DrillState = "collapsed";
			if (oNode.ID === "0") {
				oNode.MANAGER_ID = null;
			} else {
				oNode.MANAGER_ID = oNode.ID.includes(".")
					? oNode.ID.slice(0, oNode.ID.lastIndexOf("."))
					: "0";
			}

			if (oNode.MANAGER_ID) {
				(mChildrenByParentId[oNode.MANAGER_ID] ??= []).push(oNode);
			}
			mNodeById[oNode.ID] = oNode;
			mRevisionOfAgeById[oNode.ID] = 0;
		});

		// mark all leaves; others are by default collapsed (and expanded only via TopLevels)
		aAllNodes.filter((oNode) => !(oNode.ID in mChildrenByParentId))
			.forEach((oNode) => { oNode.DrillState = "leaf"; });

		// compute DescendantCount of unlimited hierarchy
		(function computeDescendantCount(sId) {
			const aChildren = mChildrenByParentId[sId] || [];
			mNodeById[sId].DescendantCount = aChildren.reduce((iCount, oChild) => {
				computeDescendantCount(oChild.ID);
				return iCount + oChild.DescendantCount;
			}, aChildren.length);
		})("0");
	}

	/**
	 * Fills the given response object from the given list of rows, taking $select, $count, $skip,
	 * and $top into account.
	 *
	 * @param {object[]} aRows - List of row objects to build the response from
	 * @param {Object<string>} mQueryOptions - Map of (system) query options (names to values)
	 * @param {object} oResponse - Response object to fill
	 */
	function selectCountSkipTop(aRows, mQueryOptions, oResponse) {
		const aSelect = mQueryOptions.$select.split(",");

		function select(oNode) {
			const oResult = {};
			for (const sSelect of aSelect) {
				oResult[sSelect] = sSelect === "DescendantCount" || sSelect === "DistanceFromRoot"
					? String(oNode[sSelect]) // Edm.Int64
					: oNode[sSelect];
			}
			return oResult;
		}

		const oMessage = {};
		if ("$count" in mQueryOptions) {
			oMessage["@odata.count"] = String(aRows.length);
		}
		const iSkip = "$skip" in mQueryOptions ? parseInt(mQueryOptions.$skip) : 0;
		const iTop = "$top" in mQueryOptions ? parseInt(mQueryOptions.$top) : Infinity;
		// Note: bSkipCopy due to select
		oMessage.value = update(aRows.slice(iSkip, iSkip + iTop).map(select), true);
		oResponse.message = JSON.stringify(oMessage);
	}

	/**
	 * Returns the hierarchy's top levels in preorder.
	 *
	 * @param {number} iMaxDistanceFromRoot - Maximum distance from root to include
	 * @param {Map} [oExpandLevels] - Mapping of NodeID to Levels to be expanded
	 * @returns {object[]} - List of node objects in preorder
	 */
	function topLevels(iMaxDistanceFromRoot, oExpandLevels = new Map()) {
		const oNodeID2EffectiveExpandLevels = new Map();

		function limitedDescendantCount(oNode) {
			const aChildren = oNodeID2EffectiveExpandLevels.get(oNode.ID) > 0
				? mChildrenByParentId[oNode.ID] || [] // "expanded"
				: [];

			return aChildren.reduce((iCount, oChild) => {
				return iCount + limitedDescendantCount(oChild);
			}, aChildren.length);
		}

		return aAllNodes
			.filter((oNode) => {
				const oParent = mNodeById[oNode.MANAGER_ID];
				// Note: the parent has been visited before
				let iExpandLevels = oParent
					? oNodeID2EffectiveExpandLevels.get(oParent.ID) - 1
					: iMaxDistanceFromRoot;
				if (iExpandLevels >= 0 && oExpandLevels.has(oNode.ID)) {
					iExpandLevels = oExpandLevels.get(oNode.ID);
				}
				oNodeID2EffectiveExpandLevels.set(oNode.ID, iExpandLevels);
				return iExpandLevels >= 0;
			})
			.map((oNode) => {
				oNode = {...oNode, DescendantCount : limitedDescendantCount(oNode)};
				const bIsExpanded = oNodeID2EffectiveExpandLevels.get(oNode.ID) > 0;
				if (oNode.DrillState === "collapsed" && bIsExpanded) {
					oNode.DrillState = "expanded";
				} else if (oNode.DrillState === "expanded" && !bIsExpanded) {
					oNode.DrillState = "collapsed";
				}
				return oNode;
			});
	}

	/**
	 * Returns a copy of the given nodes, updated to the current revision.
	 *
	 * @param {object[]} aNodes
	 *   A list of (original or updated) nodes, might include <code>null</code> values
	 * @param {boolean} [bSkipCopy]
	 *   Whether "copy on write" may safely be skipped
	 * @returns {object[]}
	 *   An updated copy or the original(!) in case no update is needed
	 */
	function update(aNodes, bSkipCopy = false) {
		return aNodes.map((oNode) => {
			if (oNode && (iRevision || mRevisionOfAgeById[oNode.ID])) {
				if (!bSkipCopy) {
					oNode = {...oNode};
				}
				if ("Name" in oNode) {
					oNode.Name = oNode.Name.split(" #")[0] + " #" + iRevision;
					if (mRevisionOfAgeById[oNode.ID]) {
						oNode.Name += "+" + mRevisionOfAgeById[oNode.ID];
					}
				}
				if ("AGE" in oNode) {
					oNode.AGE
						= (oNode.AGE % 100) + 100 * (iRevision + mRevisionOfAgeById[oNode.ID]);
				}
			}

			return oNode;
		});
	}

	SandboxModel.getMetadata = ODataModel.getMetadata;
	SandboxModel.reset = reset;

	reset();

	return SandboxModel;
});
