# ***************************************************************
DIRS = EnumObj \
	   ExportCert \
	   GetPinInfo \
	   GetTimer \
	   GetTokenInfo \
	   GetUSBInfos \
	   PKCSDemo \
	   PKCStest \
	   SetTimer \
	   SetTokenName \
	
# ***************************************************************
# Entry to bring the package up to date

all: 
	for i in $(DIRS); do \
		(cd $$i && $(MAKE)) || exit 1; \
	done


# ***************************************************************
# Standard entries to remove files from the directories

.PHONY:clean
clean: 
	for i in $(DIRS); do \
		(cd $$i && $(MAKE) clean) || exit 1; \
	done
